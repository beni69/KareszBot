import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: "poll" },
    async ({ message, text }) => {
        message.delete();
        const msg = await message.channel.send(
            `Poll by ${message.author}: ${text}`
        );
        msg.react("776837718797320234"); // upvote
        msg.react("776836162102099979"); // downvote
    }
);
