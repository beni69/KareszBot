import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: ["ping", "p"], cooldown: "10s" },
    ({ message, prefix }) => {
        message.channel.send(`🏓 ${Date.now() - message.createdTimestamp}ms`);
    }
);
