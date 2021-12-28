import { Command } from "@beni69/cmd";
import {
    DiscordGatewayAdapterCreator,
    entersState,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from "@discordjs/voice";
import { GuildMember } from "discord.js";
import { MusicManager, Queue, Track, YTSearch, YTVID_RE } from ".";

export const command = new Command(
    {
        names: "play",
        description: "play a song",
        options: [
            {
                name: "song",
                description: "the youtube url or a search term",
                type: "STRING",
                required: true,
            },
        ],
        deferred: true,
        ephemeral: true,
        noDM: true,
    },
    async ({ trigger, text }) => {
        let url = text;
        let queue = MusicManager.get(trigger.guild!.id);

        if (!queue) {
            if (
                trigger.member instanceof GuildMember &&
                trigger.member.voice.channel
            ) {
                const { channel } = trigger.member.voice;
                queue = new Queue(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild
                            .voiceAdapterCreator as DiscordGatewayAdapterCreator,
                    }),
                    channel.guild.id
                );
                queue.voiceConnection.on("error", console.warn);
                MusicManager.set(trigger.guild!.id, queue);
            }
        }
        // user not in a vc
        if (!queue) {
            await trigger.followUp({
                content: "join a channel first",
                ephemeral: true,
            });
            return false;
        }

        // make sure the connection's ready
        try {
            await entersState(
                queue.voiceConnection,
                VoiceConnectionStatus.Ready,
                20e3
            );
        } catch (err) {
            console.warn(err);
            await trigger.followUp({
                content: "failed to join channel, try again later",
                ephemeral: true,
            });
            return;
        }

        try {
            // if the url is a search term
            if (!YTVID_RE.test(url)) url = await YTSearch(url);

            // creating a track
            const track = await Track.from(url, {
                onStart() {
                    trigger.followUp({
                        content: "now playing!",
                        ephemeral: true,
                    });
                },
                onFinish() {
                    trigger.followUp({
                        content: "now finished",
                        ephemeral: true,
                    });
                },
                onError(err) {
                    console.warn(err);
                    trigger.followUp({
                        content: `Error: ${err.message}`,
                        ephemeral: true,
                    });
                },
            });
            queue.add(track);
            await trigger.followUp(`Added **${track.title}** to the queue`);
            return true;
        } catch (err) {
            console.warn(err);
            await trigger.followUp("Failed to play track, try again later");
        }
    }
);
