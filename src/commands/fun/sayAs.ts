import { Command } from "@beni69/cmd";
import { TextChannel, WebhookClient } from "discord.js";

export const command = new Command(
    {
        names: ["sayas"],
        description: "disguise yourself as someone else",
        options: [
            {
                name: "target",
                description: "the user you want to impersonate",
                type: "USER",
                required: true,
            },
            {
                name: "message",
                description: "whatever you want to say",
                type: "STRING",
                required: true,
            },
        ],
        ephemeral: true,
        noDM: true,
    },
    async ({ trigger, client, args, argv, text }) => {
        const target = argv.getUser("target");

        if (!target) {
            trigger.reply("as who?");
            return false;
        }

        const wh = await (trigger.channel as TextChannel).createWebhook(
            target.username,
            { avatar: target.displayAvatarURL({ dynamic: true }) }
        );

        const msg=trigger.isClassic()?text:argv.getString("message",true)

        await wh.send(msg);
        await wh.delete();

        trigger.isSlash() && trigger.reply("✅");
    }
);
