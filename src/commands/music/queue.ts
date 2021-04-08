import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import { Music } from ".";

export const command = new Command(
    { names: ["queue", "q"], noDM: true },
    ({ message }) => {
        const queue = Music.get(message.guild!);

        const emb = new MessageEmbed()
            .setTitle("Queue")
            .setTimestamp()
            .setColor("BLURPLE");

        queue.getSongs.forEach(song =>
            emb.addField(
                song.metadata.title,
                `${song.url}\nRequested by: ${song.member.user.username}`
            )
        );

        if (!emb.fields.length) emb.setDescription("The queue is empty.");

        message.channel.send(emb);
    }
);
