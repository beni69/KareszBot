import { Command } from "@beni69/cmd";

export const command = new Command(
    {
        names: ["nickname", "name"],
        description: "change your nickname",
        options: [
            {
                name: "name",
                description: "your new name",
                type: "STRING",
                required: true,
            },
        ],
        ephemeral: true,
        react: "👌",
    },
    ({ trigger, text }) => {
        trigger.member?.setNickname(text);
        trigger.isSlash() && trigger.reply("✅");
    }
);
