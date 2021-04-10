import { Command } from "@beni69/cmd";
import Music from ".";

export const command = new Command(
    { names: "join", noDM: true, react: "👌" },
    ({ message }) => {
        if (!message.member?.voice.channelID) {
            message.channel.send("Join a channel, dumbass.");
            return false;
        }

        Music.get(message.guild!).Join(message.member.voice.channel!);
    }
);
