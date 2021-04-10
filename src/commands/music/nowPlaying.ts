import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import Music from ".";

export const command = new Command(
    { names: ["nowPlaying", "playing", "np"], noDM: true },
    ({ message, prefix }) => {
        const song = Music.get(message.guild!).getSongs[0];

        let emb;
        if (!song)
            emb = new MessageEmbed()
                .setTitle("Nothing is playing right now.")
                .setDescription(`Play some tunes with ${prefix}play`)
                .setColor("BLURPLE")
                .setTimestamp();
        else
            emb = new MessageEmbed()
                .setTitle(song.metadata.title)
                .setURL(song.url)
                .setDescription(`Requested by ${song.member.user.username}`)
                .setThumbnail(song.metadata.thumbnail)
                .setColor("BLURPLE")
                .setTimestamp();

        message.channel.send(emb);
    }
);
