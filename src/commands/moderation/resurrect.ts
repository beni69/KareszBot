import { Command } from "@beni69/cmd";
import { Guild, User, GuildMember, TeamMember } from "discord.js";
import { guild as guildModel } from "../../Mongoose";

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

export async function getRoles(member: GuildMember) {
    const g = ((await guildModel.findById(
        member.guild.id
    )) as unknown) as guildModel;
    const roles = g.roles.find(r => r.user == member.id);
    if (!roles) return null;

    console.log({ roles });

    return roles;
}
