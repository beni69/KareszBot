import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    demuxProbe,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus,
} from "@discordjs/voice/dist";
import { Snowflake } from "discord.js";
import yt from "scrape-youtube";
import { raw as ytdl } from "youtube-dl-exec";
import { getInfo } from "ytdl-core";

const wait = (t: number) =>
    new Promise(resolve => setTimeout(resolve, t).unref());

const noop = () => {};

/**
 * There's a queue for each guild. It has its own player and tracks.
 */
export class Queue {
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    public queue: Track[];
    public queueLock = false;
    public readyLock = false;
    public guildID: Snowflake;
    public loop = false;
    public nowPlaying?: Track;

    public constructor(voiceConnection: VoiceConnection, guildID: Snowflake) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.queue = [];
        this.guildID = guildID;

        this.voiceConnection.on("stateChange", async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (
                    newState.reason ===
                        VoiceConnectionDisconnectReason.WebSocketClose &&
                    newState.closeCode === 4014
                ) {
                    /*
						If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
						but there is a chance the connection will recover itself if the reason of the disconnect was due to
						switching voice channels. This is also the same code for the bot being kicked from the voice channel,
						so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
						the voice connection.
					*/
                    try {
                        await entersState(
                            this.voiceConnection,
                            VoiceConnectionStatus.Connecting,
                            5_000
                        );
                        // Probably moved voice channel
                    } catch {
                        this.voiceConnection.destroy();
                        // Probably removed from voice channel
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    /*
						The disconnect in this case is recoverable, and we also have <5 repeated attempts so we will reconnect.
					*/
                    await wait(
                        (this.voiceConnection.rejoinAttempts + 1) * 5_000
                    );
                    this.voiceConnection.rejoin();
                } else {
                    /*
						The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					*/
                    this.voiceConnection.destroy();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                /*
					Once destroyed, stop the subscription
				*/
                this.stop();
            } else if (
                !this.readyLock &&
                (newState.status === VoiceConnectionStatus.Connecting ||
                    newState.status === VoiceConnectionStatus.Signalling)
            ) {
                /*
					In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
					before destroying the voice connection. This stops the voice connection permanently existing in one of these
					states.
				*/
                this.readyLock = true;
                try {
                    await entersState(
                        this.voiceConnection,
                        VoiceConnectionStatus.Ready,
                        20_000
                    );
                } catch {
                    if (
                        this.voiceConnection.state.status !==
                        VoiceConnectionStatus.Destroyed
                    )
                        this.voiceConnection.destroy();
                } finally {
                    this.readyLock = false;
                }
            }
        });

        // Configure audio player
        this.audioPlayer.on("stateChange", (oldState, newState) => {
            if (
                newState.status === AudioPlayerStatus.Idle &&
                oldState.status !== AudioPlayerStatus.Idle
            ) {
                // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
                // The queue is then processed to start playing the next track, if one is available.
                (oldState.resource as TrackResource).metadata.onFinish();
                void this.processQueue();
            } else if (newState.status === AudioPlayerStatus.Playing) {
                // If the Playing state has been entered, then a new track has started playback.
                (newState.resource as TrackResource).metadata.onStart();
            }
        });

        this.audioPlayer.on("error", err =>
            (err.resource as TrackResource).metadata.onError(err)
        );

        voiceConnection.subscribe(this.audioPlayer);
    }

    /**
     * Add a track to the queue
     * @param track the track to add
     */
    public add(track: Track) {
        this.queue.push(track);
        void this.processQueue();
    }

    /**
     * Stops playback
     */
    public stop() {
        this.queueLock = true;
        this.queue = [];
        this.audioPlayer.stop(true);
    }

    /**
     * Stops playback and destroys the queue
     */
    public destroy() {
        this.stop();

        // destroy
        this.voiceConnection.destroy();
        MusicManager.delete(this.guildID);
    }

    /**
     * Attempts to play a track from the queue
     */
    private async processQueue(): Promise<void> {
        // return, if the queue is locked, empty, or already playing
        if (
            this.queueLock ||
            this.audioPlayer.state.status !== AudioPlayerStatus.Idle ||
            (!this.loop && this.queue.length === 0)
        )
            return;

        // lock the queue to prevent multiple calls at the same time
        this.queueLock = true;

        // get the next track to play and remove it from the queue
        const nextTrack =
            this.loop && this.nowPlaying
                ? this.nowPlaying
                : this.queue.shift()!;

        try {
            const resource = await nextTrack.createAudioResource();
            this.audioPlayer.play(resource);
            this.queueLock = false;
            this.nowPlaying = nextTrack;
        } catch (err) {
            nextTrack.onError(err);
            this.queueLock = false;
            return this.processQueue();
        }
    }
}

export interface TrackData {
    url: string;
    title: string;
    onStart: () => void;
    onFinish: () => void;
    onError: (err: Error) => void;
}

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
export class Track implements TrackData {
    public readonly url: string;
    public readonly title: string;
    public readonly onStart: () => void;
    public readonly onFinish: () => void;
    public readonly onError: (error: Error) => void;

    private constructor({ url, title, onStart, onFinish, onError }: TrackData) {
        this.url = url;
        this.title = title;
        this.onStart = onStart;
        this.onFinish = onFinish;
        this.onError = onError;
    }

    /**
     * turns this track into a playable audio resource
     */
    public createAudioResource(): Promise<TrackResource> {
        return new Promise((resolve, reject) => {
            const process = ytdl(
                this.url,
                {
                    o: "-",
                    q: "",
                    f: "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio",
                    r: "100K",
                },
                { stdio: ["ignore", "pipe", "ignore"] }
            );
            if (!process.stdout) {
                reject(new Error("no stdout"));
                return;
            }

            const stream = process.stdout;

            const onError = (err: Error) => {
                if (!process.killed) process.kill();
                stream.resume();
                reject(err);
            };
            process.once("spawn", () => {
                demuxProbe(stream)
                    .then(probe =>
                        resolve(
                            createAudioResource(probe.stream, {
                                metadata: this,
                                inputType: probe.type,
                                inlineVolume: true,
                            })
                        )
                    )
                    .catch(onError);
            });
        });
    }

    /**
     * create a track from a url
     * @param url youtube video url
     * @param methods lifecycle methods
     * @returns a Track
     */
    public static async from(
        url: string,
        methods: Pick<Track, "onStart" | "onFinish" | "onError">
    ): Promise<Track> {
        const info = await getInfo(url);

        // The methods are wrapped so that we can ensure that they are only called once.
        const wrappedMethods = {
            onStart() {
                wrappedMethods.onStart = noop;
                methods.onStart();
            },
            onFinish() {
                wrappedMethods.onFinish = noop;
                methods.onFinish();
            },
            onError(error: Error) {
                wrappedMethods.onError = noop;
                methods.onError(error);
            },
        };

        return new Track({
            title: info.videoDetails.title,
            url,
            ...wrappedMethods,
        });
    }
}

export type TrackResource = AudioResource<Track>;

export const MusicManager = new Map<Snowflake, Queue>();

export const YTSearch = async (q: string) => {
    const res = await yt.search(q, { type: "video" });

    const vid = res.videos[0];

    return vid.link;
};
