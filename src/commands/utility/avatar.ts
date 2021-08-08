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
    ({ trigger, argv }) => {
        const user = argv.getUser("user") || trigger.author;

        trigger.reply(user.displayAvatarURL({ dynamic: true, format: "png" }));
    }
);
