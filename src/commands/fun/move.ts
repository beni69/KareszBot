import { Command } from "@beni69/cmd";
import { ChannelResolvable, GuildMember } from "discord.js";

export const command = new Command(
    { names: "move", react: "👌" },
    async ({ message, args, text }) => {
        // move everyone
        if (args[0] === "all" || args[0] === "@everyone") {
            const chanName = text.replace(args[0], "").trim();

            move("all", chanName);
        }
        // move the @
        else if (message.mentions.users.size) {
            const member = message.guild?.members.cache.get(
                message.mentions.users.first()?.id as string
            );
            const chanName = text
                .replace(member?.toString()?.replace("<@", "<@!") as string, "")
                .trim();

            move(member, chanName);
        }
        // move the author
        else {
            move(message.member, text);
        }

        function move(
            member: GuildMember | "all" | null | undefined,
            chanName: string
        ) {
            const chan =
                message.guild?.channels.cache.get(chanName) ||
                message.guild?.channels.cache.find(ch => ch.name == chanName);

            if (!member) return message.channel.send("Member not found!");
            else if (!chan) return message.channel.send("Channel not found.");

            try {
                // if all
                if (member === "all") {
                    message.guild?.members.cache
                        .filter(m => (m.voice.channel ? true : false))
                        .forEach(m => m.voice.setChannel(chan));
                }
                // if only one user
                else member.voice.setChannel(chan);
            } catch (err) {
                message.channel.send("An error occured.");
            }
        }
    }
);
