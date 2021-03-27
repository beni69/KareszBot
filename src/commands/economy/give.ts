import { Command } from "@beni69/cmd";
import { Guild } from "discord.js";
import { Economy } from "./economy";

export const command = new Command(
    { names: "give", react: "👌", noDM: true, adminOnly: true, minArgs: 1 },
    async ({ message, client, args }) => {
        const e = new Economy(client, message.guild as Guild);

        const n = parseInt(args[0]);

        if (isNaN(n)) {
            message.reply("provide a number!");
            return false;
        }
        await e.give(message.author.id, n);
    }
);
