import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import { Music, Song } from ".";

// export const command = new Command({ names: "play" }, async ({ message }) => {
//     if (!message.member?.voice.channelID) {
//         message.channel.send("Join a channel, dumbass.");
//         return false;
//     }

//     const connection = await message.member.voice.channel?.join();
//     if (!connection) {
//         message.channel.send(
//             "An error occured while joining the voice channel."
//         );
//         return false;
//     }

//     connection
//         .play(await ytdl("https://youtu.be/SBUu1kBcksQ"), {
//             type: "opus",
//         })
//         .on("finish", () => {});
// });

export const command = new Command(
    { names: ["play", "add"], noDM: true, react: "👌" },
    async ({ message, text, argv }) => {
        if (!message.member?.voice.channelID) {
            message.channel.send("Join a channel, dumbass.");
            return false;
        }

        const queue = Music.get(message.guild!);

        // support for escaping embeds
        if (text.startsWith("<") && text.endsWith(">"))
            text = text.substring(1, text.length - 1);

        const r = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;

        let song!: Song;
        if (r.test(text)) {
            //* url given

            const songData = await Song.GetData(text);
            if (!songData) {
                message.channel.send("We couldn't find that video.");
                return false;
            }

            song = new Song(text, message.member!, songData);
        } else {
            //* vid name given, have to search first

            const res = await Song.Search(text, message.member);
            if (!res) {
                message.channel.send("We couldn't find that video.");
                return false;
            }
            song = res;
        }
        queue.Add(song);

        message.channel.send(
            new MessageEmbed()
                .setTitle(song.metadata.title)
                .setURL(song.url)
                .setDescription(`By: ${song.metadata.author}`)
                .setImage(song.metadata.thumbnail)
                .setColor("BLURPLE")
                .setTimestamp()
        );

        if (!queue.isPlaying || argv.f || argv.force)
            queue.Play(message.member?.voice.channel!);
    }
);
