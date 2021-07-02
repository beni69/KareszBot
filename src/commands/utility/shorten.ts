import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

const URL = "https://krsz.me/api/url/create";

export const command = new Command(
    {
        names: ["shorten", "shortener", "krszme"],
        description: "shorten a link",
        options: [
            {
                name: "url",
                description: "the long link",
                type: "STRING",
                required: true,
            },
        ],
    },
    async ({ trigger, argv, text }) => {
        const emb = new MessageEmbed()
            .setTimestamp()
            .setTitle("krsz.me")
            .setURL("https://krsz.me");

        const dest = trigger.isClassic() ? text : argv.get("url");

        const body = { dest };

        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log({ data });

        if (!res.ok) {
            let error = "Sorry, something went wrong";

            switch (data.code) {
                case 10001:
                    error = "Please provide a valid link.";
                    break;
            }

            emb.setColor("RED").setDescription(error);
            trigger.reply({ embeds: [emb] });
            return false;
        }

        emb.setColor("GREEN").setDescription(data.url);
        trigger.reply({ embeds: [emb] });
    }
);
