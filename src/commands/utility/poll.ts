import { Command } from "@beni69/cmd";

export const command = new Command(
    {
        names: "poll",
        description: "create a poll",
        options: [
            {
                name: "quetion",
                description: "ask something!",
                type: "STRING",
                required: true,
            },
        ],
    },
    async ({ trigger, text }) => {
        await trigger.reply(`Poll by ${trigger.author}: ${text}`);
        const msg = await trigger.fetchReply();
        msg.react("776837718797320234"); // upvote
        msg.react("776836162102099979"); // downvote
        return true;
    }
);
