import { GuildMember } from "discord.js";
import { guild as guildModel } from "../../Mongoose";

export async function getRoles(member: GuildMember) {
    const g = ((await guildModel.findById(
        member.guild.id
    )) as unknown) as guildModel;
    if (!g.roles) return null;

    const roles = g.roles.find(r => r.user == member.id);
    if (!roles) return null;

    return roles;
}

export async function saveRoles(member: GuildMember) {
    // get roles
    const roles = member?.roles.cache
        .filter(r => r.name != "@everyone")
        .map(r => r.id);

    if (!(await guildModel.exists({ _id: member.guild.id }))) {
        await new guildModel({
            _id: member.guild.id,
        }).save();
    }

    const g: guildModel | null = (await guildModel.findById(
        member.guild.id
    )) as guildModel;

    const savedRole = { user: member.id, roles, timestamp: Date.now() };

    if (!g.roles) g.roles = [];
    // overwrite user if already exists
    else if (g.roles.find(r => r.user == member.id)) {
        const i = g.roles.findIndex(r => r.user == member.id);
        g.roles.splice(i, 1);
    }

    g.roles.push(savedRole);

    await g.updateOne({ roles: g.roles });
}
