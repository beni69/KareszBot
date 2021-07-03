import { Command } from "@beni69/cmd";
import { MusicManager } from ".";

export const command = new Command(
    {
        names: ["loop", "l"],
        description: "keep playing the current song",
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger }) => {
        const queue = MusicManager.get(trigger.guild!.id);

        if (!queue) {
            await trigger.reply("nothing's playing");
            return false;
        }

        queue.loop = !queue.loop;

        await trigger.reply(queue.loop ? "looping on" : "looping off");
    }
);
