import { Command } from "@beni69/cmd";
import { MusicManager } from ".";

export const command = new Command(
    {
        names: ["skip", "next"],
        description: "play the next song in the queue",
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (!queue) {
            await trigger.reply("nothing's playing");
            return false;
        }

        queue.audioPlayer.stop(); // stopping the song will trigger the next one

        await trigger.reply("skipped song!");
        return true;
    }
);
