import { Command } from "@beni69/cmd";
import { MusicManager } from ".";

export const command = new Command(
    {
        names: "pause",
        description: "pause music playback",
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (!queue) {
            await trigger.reply("nothing's playing");
            return false;
        }

        queue.audioPlayer.pause();

        await trigger.reply("paused!");
        return true;
    }
);
