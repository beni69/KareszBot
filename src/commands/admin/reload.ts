import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "reload", adminOnly: true },
    async ({ message, handler }) => {
        const status = await message.channel.send("Reloading commands...");

        await handler.loadCommands(handler.commandsDir, true);

        status.edit("Reload done 👌");
    }
);

const add = (a: number, b: number): number => a + b;
