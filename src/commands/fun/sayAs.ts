import { Command } from "@beni69/cmd";
import { TextChannel, WebhookClient } from "discord.js";

export const command = new Command(
    { names: ["sayas"], cooldown: "10s" },
    async ({ message, args }) => {
        if (message.channel.type === "dm") {
            message.channel.send("can't do this in the dms");
            return false;
        }

        const target = message.mentions.users.first();
        if (!target) {
            message.channel.send("as who?");
            return false;
        }

        const wh = await (message.channel as TextChannel).createWebhook(
            target.username,
            { avatar: target.displayAvatarURL({ dynamic: true }) }
        );

        args.shift();

        await wh.send(args.join(" "));

        wh.delete();
    }
);
