import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "eval", adminOnly: true },
    async ({ message, argv }) => {
        const cmd = argv._.join(" ");

        try {
            if (argv.r || argv.raw) eval(cmd);
            else message.channel.send(`${eval(cmd)}`, { code: true });
        } catch (err) {
            message.channel.send(`There was an error\n${err}`);
        }
    }
);
