import {
    Collection,
    Guild,
    GuildMember,
    VoiceChannel,
    VoiceConnection,
} from "discord.js";
import ytdl from "ytdl-core-discord";
import youtube from "scrape-youtube";

export class MusicManager {
    public queue: Collection<string, Queue>;

    constructor() {
        this.queue = new Collection();
    }

    /**
     * Get the queue for a guild
     * @param guild - The guild to get the queue of
     */
    public get(guild: Guild) {
        if (!this.queue.has(guild.id))
            this.queue.set(guild.id, new Queue(this, guild));

        return this.queue.get(guild.id) as Queue;
    }
}
export const Music = new MusicManager();
export default Music;

export class Queue {
    public readonly manager: MusicManager;
    public readonly guild: Guild;
    private queue: Song[];
    private connection?: VoiceConnection;
    private channel?: VoiceChannel;
    private playing: boolean;

    /**
     * Queue
     * @param {*} manager - The manager the queue belongs to
     * @param {*} guild - The guild the queue belongs to
     */
    constructor(manager: MusicManager, guild: Guild) {
        this.manager = manager;
        this.guild = guild;
        this.queue = [];
        this.playing = false;
    }

    public get getSongs(): Song[] {
        return this.queue;
    }

    public get isPlaying(): boolean {
        return this.playing;
    }

    /**
     * Start playing the queue
     * @param {*} channel - The channel to play in
     */
    public async Play(channel?: VoiceChannel) {
        if (!this.queue[0]) return null;
        if (channel) {
            this.channel = channel;
            await this.Join(this.channel);
        } else if (!this.channel) return null;

        this.playing = true;

        this.connection
            ?.play(await this.queue[0].Play(), { type: "opus" })
            .on("finish", () => this.Next());
    }

    /**
     * Join
     */
    public async Join(channel: VoiceChannel) {
        this.connection = await channel.join();
    }

    /**
     * Leave the channel
     */
    public Leave() {
        if (this.channel) {
            this.channel.leave();
            this.channel = undefined;
        }
        if (this.connection) {
            this.connection.disconnect();
            this.connection = undefined;
        }
    }
    /**
     * Add a song to the queue
     * @param {*} song - The song to add
     */
    public Add(song: Song) {
        this.queue.push(song);
    }

    /**
     * Play the next song in the queue.
     * @returns null, when there are no songs left, otherwise it returns the new song
     */
    public Next() {
        if (!this.queue.shift() || !this.queue.length) {
            if (this.connection) this.connection.disconnect();
            this.playing = false;
            return null;
        }

        this.Play();
        return this.queue[0];
    }

    /**
     * Destroys the queue
     */
    public Destroy() {
        this.Leave();
        this.manager.queue.delete(this.guild.id);
    }
}

export class Song {
    public static async GetData(url: string) {
        if (!ytdl.validateURL(url)) return null;

        const res = await ytdl.getBasicInfo(url);

        return {
            title: res.videoDetails.title,
            author: res.videoDetails.author.name,
            thumbnail: res.thumbnail_url,
        } as SongData;
    }

    /**
     * Searches youtube for the specified string, and returns the first result.
     * @returns Song
     */
    public static async Search(str: string, member: GuildMember) {
        const res = (await youtube.search(str, { type: "video" })).videos[0];

        if (!res) return null;

        return new Song(res.link, member, {
            title: res.title,
            author: res.channel.name,
            thumbnail: res.thumbnail,
        });
    }

    public readonly url: string;
    public readonly member: GuildMember;
    public readonly metadata: SongData;

    constructor(url: string, member: GuildMember, metadata: SongData) {
        this.url = url;
        this.member = member;

        this.metadata = metadata;
    }

    /**
     * @returns a playable stream of the song
     */
    public Play() {
        return ytdl(this.url);
    }
}

type SongData = {
    title: string;
    author: string;
    thumbnail: string;
};
