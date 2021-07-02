import { Command } from "@beni69/cmd";
import { Guild } from "discord.js";
import { Economy } from ".";

export const command = new Command(
    {
        names: "give",
        description: "give money to someone",
        react: "👌",
        noDM: true,
        adminOnly: true,
        noSlash: true,
        minArgs: 1,
    },
    async ({ trigger, client, args }) => {
        const e = new Economy(client, trigger.guild as Guild);

        const n = parseInt(args[0]);

        if (isNaN(n)) {
            trigger.reply("provide a number!");
            return false;
        }
        await e.give(trigger.author.id, n);
    }
);
