import { Command } from "@beni69/cmd";
import type { GuildMember, Role } from "discord.js";

export const command = new Command(
    {
        names: ["op"],
        description: "make someone an admin",
        react: "👌",
        options: [
            {
                name: "target",
                type: "USER",
                description: "who to op (defaults to self)",
                required: false,
            },
            {
                name: "role",
                type: "ROLE",
                description: "name of role to give (defaults to admin)",
                required: false,
            },
        ],
        adminOnly: true,
        noSlash: true,
    },
    async ({ trigger, argv }) => {
        if (!trigger.isClassic()) return false;

        const adminRole =
            (argv.getRole("role") as Role | undefined) ||
            trigger.guild?.roles.cache.find(
                r => r.name.toLowerCase() === "admin"
            );

        if (!adminRole) {
            await trigger.reply("No role found.");
            return false;
        }

        const target =
            (argv.getMember("target") as GuildMember | undefined) ||
            trigger.member;

        try {
            await target?.roles.add([adminRole]);
            return true;
        } catch (err) {
            trigger.reply("error adding roles");
            console.error(err);
        }
    }
);
