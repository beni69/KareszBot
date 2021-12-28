import { Command } from "@beni69/cmd";
import { GuildMember } from "discord.js";
import { getRoles } from ".";

export const command = new Command(
    {
        names: ["resurrect", "res"],
        description: "get your roles back after getting killed",
        react: "👌",
        noSlash: true,
    },
    async ({ trigger }) => {
        if (trigger.isSlash()) return;
        const message = trigger.source;
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
        roles.roles.forEach(r => target.roles.add(r));

        return true;
    }
);
