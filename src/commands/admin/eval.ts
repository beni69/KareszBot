import { Command } from "@beni69/cmd";
import { saveRoles, getRoles } from "../moderation";
// import { Music, Queue } from "../music";

export const command = new Command(
    {
        names: "eval",
        description: "evaluate a string as javascript",
        adminOnly: true,
        noSlash: true,
        argvAliases: { raw: ["r"] },
    },
    async ({ trigger, client, handler, args, argv, text, logger, prefix }) => {
        if (!trigger.isClassic()) return false;

        // const cmd = argv._.join(" ");
        const cmd = argv.get("_yargs")._.join(" ");

        const { log } = console;

        // let queue: Queue | undefined = undefined;
        // if (trigger.guild) queue = Music.get(trigger.guild);

        try {
            if (argv.get("raw")) await eval(cmd);
            else trigger.reply("```" + (await eval(cmd)) + "```");
        } catch (err) {
            trigger.reply("There was an error\n```" + err + "```");
        }
    }
);
