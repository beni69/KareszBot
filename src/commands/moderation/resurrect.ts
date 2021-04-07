import { Command } from "@beni69/cmd";
import { GuildMember } from "discord.js";
import { getRoles } from "./moderation";

export const command = new Command(
    { names: ["resurrect", "res"], react: "👌" },
    async ({ message }) => {
        let target: GuildMember;
        if (message.mentions.users.size)
            target = (await message.guild?.members.fetch(
                message.mentions.users.first()!.id
            )) as GuildMember;
        else target = message.member as GuildMember;

        if (target.user.bot) {
            message.reply("Resurrecting bots is currently not supported.");
            return false;
        }

        const roles = await getRoles(target);
        if (!roles) {
            message.reply("Roles not found. 💀");
            return false;
        }
        target.roles.add(roles.roles);
        console.log(roles.roles);
    }
);
