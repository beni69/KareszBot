import { Command } from "@beni69/cmd";
import { Guild } from "discord.js";
import { Economy } from ".";

export const command = new Command(
    { names: ["balance", "bal"], description: "get your balance", noDM: true },
    async ({ trigger, client }) => {
        const e = new Economy(client, trigger.guild as Guild);
        const f = await e.getBalance(trigger.author.id);

        if (!f) trigger.reply("Your wallet is empty. 😫");
        else trigger.reply("Your balance: " + f?.balance + f?.currency);

        return true;
    }
);
