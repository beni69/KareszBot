import { Command } from "@beni69/cmd";
import { Guild, User } from "discord.js";
import * as models from "../../Mongoose";

export const command = new Command(
    { names: ["resurrect", "res"], react: "👌" },
    async ({ message }) => {
        if (message.mentions.users.size) {
            const user = message.mentions.users.first()!;
            const roles = await getRoles(message.guild!, user!);

            const member = message.guild?.members.cache.get(user.id);
            member?.roles.add(roles.roles);
        } else {
            const roles = await getRoles(message.guild!, message.author);
            message.member?.roles.add(roles.roles);
        }
    }
);

export async function getRoles(guild: Guild, user: User) {
    const member = guild.members.cache.get(user.id);
    const found = ((await models.user.findById(
        user.id
    )) as unknown) as models.user;

    return found;
}
