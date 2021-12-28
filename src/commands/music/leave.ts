import { Command } from "@beni69/cmd";
import { MusicManager } from ".";

export const command = new Command(
    {
        names: ["leave", "stop", "stfu"],
        description: "stop the music and leave the channel",
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (!queue) {
            await trigger.reply("nothing's playing");
            return false;
        }

        queue.destroy();
        await trigger.reply("bye! 👋");
        return true;
    }
);
