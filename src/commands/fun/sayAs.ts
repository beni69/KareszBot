import { Command } from "@beni69/cmd";
import { TextChannel, WebhookClient } from "discord.js";

export const command = new Command(
    { names: ["sayas"] },
    async ({ message, args }) => {
        if (message.channel.type === "dm")
            return message.channel.send("can't do this in the dms");

        const target = message.mentions.users.first();
        if (!target) return message.channel.send("as who?");

        const wh = await (message.channel as TextChannel).createWebhook(
            target.username,
            { avatar: target.displayAvatarURL({ dynamic: true }) }
        );

        args.shift();

        await wh.send(args.join(" "));

        wh.delete();
    }
);
