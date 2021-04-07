import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "eval", adminOnly: true },
    async ({ message, client, handler, args, argv, text, logger, prefix }) => {
        const cmd = argv._.join(" ");

        const { saveRoles, getRoles } = await import(
            "../moderation/moderation"
        );

        try {
            if (argv.r || argv.raw) await eval(cmd);
            else message.channel.send(`${await eval(cmd)}`, { code: true });
        } catch (err) {
            message.channel.send("There was an error\n```" + err + "```");
        }
    }
);
