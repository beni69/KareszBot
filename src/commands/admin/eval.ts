import { Command } from "@beni69/cmd";
import { saveRoles, getRoles } from "../moderation";
// import { Music, Queue } from "../music";

export const command = new Command(
    {
        names: "eval",
        description: "evaluate a string as javascript",
        adminOnly: true,
        noSlash: true,
    },
    async ({ trigger, client, handler, args, argv, text, logger, prefix }) => {
        if (!trigger.isClassic()) return false;

        const { log } = console;

        const cmd =
            text.startsWith("```") && text.endsWith("```")
                ? text.slice(3, -3).trim()
                : text;

        // let queue: Queue | undefined = undefined;
        // if (trigger.guild) queue = Music.get(trigger.guild);

        try {
            trigger.reply("```" + (await eval(cmd)) + "```");
        } catch (err) {
            trigger.reply("There was an error\n```" + err + "```");
        }
    }
);
