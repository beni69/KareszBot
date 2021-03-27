import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

const URL = "https://api.karesz.xyz/shortener";
export const command = new Command(
    { names: ["shorten", "shortener", "krszme"] },
    async ({ message, argv }) => {
        const text = argv._.join(" ");

        const body = { dest: text };

        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log({ data });

        if (!res.ok) {
            message.channel.send("Sorry, something went wrong");
            return false;
        }

        const emb = new MessageEmbed()
            .setTimestamp()
            .setColor("GREEN")
            .setTitle("krsz.me")
            .setURL("https://krsz.me")
            .setDescription(data.created.url);
        message.channel.send(emb);
    }
);
