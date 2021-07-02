import { Command } from "@beni69/cmd";

export const command = new Command(
    {
        names: ["avatar", "pfp", "profilepic"],
        description: "get someones profile pic",
        options: [
            {
                name: "user",
                description: "whos profile pic to get",
                type: "USER",
                required: false,
            },
        ],
    },
    ({ trigger, client, argv }) => {
        const user = trigger.isClassic()
            ? trigger.source.mentions.users.first()
            : client.users.resolve(argv.get("user"));
        if (user) {
            trigger.reply(
                user!.displayAvatarURL({ dynamic: true, format: "png" })
            );
        } else {
            trigger.reply(
                trigger.author.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                })
            );
        }
    }
);
