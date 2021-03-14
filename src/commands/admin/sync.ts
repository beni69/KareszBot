import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "sync", adminOnly: true, react: "👌" },
    async ({ handler }) => {
        await handler.sync();
    }
);
