import { Command } from "@beni69/cmd";
import { Guild } from "discord.js";
import { Economy } from "./economy";

export const command = new Command(
    { names: ["balance", "bal"], noDM: true },
    async ({ message, client }) => {
        const e = new Economy(client, message.guild as Guild);
        const f = await e.getBalance(message.author.id);

        message.channel.send("Your balance: " + (f?.balance || 0));
    }
);
