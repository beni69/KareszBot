import { Command } from "@beni69/cmd";
import { AudioPlayerStatus } from "@discordjs/voice";
import { MusicManager, TrackResource } from ".";

export const command = new Command(
    {
        names: ["queue", "q"],
        description: "show the music queue",
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (queue) {
            const current =
                queue.audioPlayer.state.status === AudioPlayerStatus.Idle
                    ? "nothing's playing"
                    : `Playing **${
                          (queue.audioPlayer.state.resource as TrackResource)
                              .metadata.title
                      }**`;

            const q = queue.queue
                .slice(0, 5)
                .map((track, i) => `${++i} ${track.title}`)
                .join("\n");

            await trigger.reply(`${current}\n\n${q}`);
        } else {
            await trigger.reply("nothing's playing right now");
        }
    }
);
