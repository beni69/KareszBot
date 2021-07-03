import { Command } from "@beni69/cmd";
import { AudioPlayerStatus } from "@discordjs/voice/dist";
import { MusicManager } from ".";

export const command = new Command(
    {
        names: "volume",
        description: "display or change playback volume",
        options: [
            {
                name: "volume",
                description: "the new volume (default: 100)",
                type: "INTEGER",
                required: false,
            },
        ],
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger, args }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (
            !queue ||
            queue.audioPlayer.state.status === AudioPlayerStatus.Idle
        ) {
            await trigger.reply("nothing's playing");
            return false;
        }

        const v = parseFloat(args[0]);
        const playerVolume = queue.audioPlayer.state.resource.volume;

        if (!playerVolume) {
            await trigger.reply("the volume can't be adjusted");
            return false;
        }

        if (!v)
            await trigger.reply(
                `The current volume is ${playerVolume.volume * 100}%`
            );
        else {
            queue.audioPlayer.state.resource.volume?.setVolume(v / 100);
            await trigger.reply(
                `Done! new volume is ${playerVolume.volume * 100}%`
            );
        }
    }
);
