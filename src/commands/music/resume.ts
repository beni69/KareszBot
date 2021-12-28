import { Command } from "@beni69/cmd";
import { MusicManager } from ".";

export const command = new Command(
    {
        names: "resume",
        description: "resume music playback",
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (!queue) {
            await trigger.reply("nothing's playing");
            return false;
        }

        queue.audioPlayer.unpause();

        await trigger.reply("resumed!");
        return true;
    }
);
