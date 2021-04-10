import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: ["op"], adminOnly: true },
    async ({ message, argv }) => {
        const adminRole =
            message.guild?.roles.cache.get((argv.r || argv.role) as string) ||
            message.guild?.roles.cache.find(
                r =>
                    r.name.toLowerCase() ===
                    ((argv.r || argv.role || "admin") as string)
            );
        if (!adminRole) {
            message.channel.send("No role found.");
            return false;
        }

        if (message.mentions.users.size) {
            const user = await message.guild?.members.fetch(
                message.mentions.users.first()!.id
            );
            try {
                user?.roles.add(adminRole);
            } catch (err) {
                console.log(err);
            }
        } else {
            message.member?.roles.add(adminRole);
        }
    }
);
