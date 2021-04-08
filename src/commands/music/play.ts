import { Command } from "@beni69/cmd";
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

        // support for escaping embeds
        if (text.startsWith("<") && text.endsWith(">"))
            text = text.substring(1, text.length - 1);

        const r = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;

        if (!r.test(text)) {
            message.channel.send("Not a valid youtube url.");
            return false;
        }

        const queue = Music.get(message.guild!);

        queue.Add(new Song(text, message.member!));
        if (!queue.isPlaying || argv.f || argv.force)
            queue.Play(message.member?.voice.channel!);
    }
);
