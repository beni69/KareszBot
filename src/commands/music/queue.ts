import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import { Music } from ".";

export const command = new Command(
    { names: ["queue", "q"], noDM: true },
    ({ message }) => {
        const queue = Music.get(message.guild!);

        const emb = new MessageEmbed().setTimestamp().setColor("BLURPLE");

        queue.getSongs.forEach(song =>
            emb.addField("song.getURL", song.getURL)
        );

        message.channel.send(emb);
    }
);
