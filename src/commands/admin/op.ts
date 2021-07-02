import { Command } from "@beni69/cmd";

export const command = new Command(
    {
        names: ["op"],
        description: "make someone an admin",
        react: "👌",
        argvAliases: { role: ["r"] },
        adminOnly: true,
        noSlash: true,
    },
    async ({ trigger, argv }) => {
        if (!trigger.isClassic()) return false;

        const adminRole =
            trigger.guild?.roles.cache.get(argv.get("role")) ||
            trigger.guild?.roles.cache.find(
                r =>
                    r.name.toLowerCase() ===
                    ((argv.get("role") || "admin") as string)
            );
        if (!adminRole) {
            await trigger.reply("No role found.");
            return false;
        }

        if (trigger.source.mentions.users.size) {
            const user = await trigger.guild?.members.fetch(
                trigger.source.mentions.users.first()!.id
            );
            try {
                user?.roles.add(adminRole);
            } catch (err) {
                console.log(err);
            }
        } else {
            await trigger.member?.roles.add(adminRole);
        }
    }
);
