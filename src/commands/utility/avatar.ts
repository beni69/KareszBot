import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: ["pfp", "profilepic", "avatar"] },
    ({ message }) => {
        if (message.mentions.users.size) {
            const user = message.mentions.users.first();
            message.channel.send(
                user!.displayAvatarURL({ dynamic: true, format: "png" })
            );
        } else {
            message.channel.send(
                message.author.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                })
            );
        }
    }
);
