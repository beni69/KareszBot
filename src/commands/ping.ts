import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: ["ping", "p"], description: "pong!", cooldown: "10s" },
    async ({ trigger }) => {
        await trigger.reply(`🏓 ${Date.now() - trigger.createdTimestamp}ms`);
    }
);
