import { Command } from "@beni69/cmd";
import { saveRoles, getRoles } from "../moderation";
import { Music, Queue } from "../music";

export const command = new Command(
    { names: "eval", adminOnly: true },
    async ({ message, client, handler, args, argv, text, logger, prefix }) => {
        const cmd = argv._.join(" ");

        const log = console.log;

        let queue: Queue | undefined = undefined;
        if (message.guild) queue = Music.get(message.guild);

        try {
            if (argv.r || argv.raw) await eval(cmd);
            else message.channel.send(`${await eval(cmd)}`, { code: true });
        } catch (err) {
            message.channel.send("There was an error\n```" + err + "```");
        }
    }
);
