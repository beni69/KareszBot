import { Command } from "@beni69/cmd";
import { GuildMember } from "discord.js";
import { guild as guildModel } from "../../Mongoose";

export const command = new Command(
    {
        names: ["kill", "kick"],
        cooldown: "24h",
        minArgs: 1,
        maxArgs: 1,
        noDM: true,
        react: "⚰",
    },
    async ({ message, client, handler, logger }) => {
        // suicide
        if (Math.floor(Math.random() * 6.9) == 0) {
            if (
                handler.getOpts.admins.has(message.author.id) ||
                message.author.id == message.guild?.ownerID
            )
                return message.channel.send(
                    "You would have been killed, if you weren't the server owner. However, the cooldown still applies."
                );

            await saveRoles(message.member as GuildMember);

            message.member
                ?.kick("Tried to kill, but failed.")
                .catch(err =>
                    logger
                        ? logger.log(message, [
                              "$authorTag$",
                              " in ",
                              "$channelTag$",
                              ":\t",
                              "self kill failed.",
                          ])
                        : null
                );

            message.author.send(
                `So unlucky! You shot yourself and have been kicked from **${message.guild?.name}**.\nThere was a 1 in 6.9 chance of that happening. Better luck next time! 🤷‍♂️`
            );
            message.channel.send(
                `${message.author.tag} looked inside the barrel of their own gun to see if it works. They (obviously) died. Such a dumbass.`
            );
        }
        // normal kill
        else {
            const target = message.mentions.users.first();
            if (!target) {
                message.channel.send("Mention someone you dumbass.");
                return false;
            }
            const targetMember = message.guild?.members.cache.get(
                target!.id
            ) as GuildMember;

            if (handler.getOpts.admins.has(target.id)) {
                message.channel.send("Bro I won't kill my owner.");
                return false;
            } else if (message.guild?.ownerID == target.id) {
                message.channel.send("Sadly, you can't kick the server owner.");
                return false;
            } else if (client.user?.id == target.id) {
                message.channel.send("bruh i wont commit oof");
                return false;
            }

            await saveRoles(targetMember);

            targetMember?.kick(`Killed by ${message.author.tag}`).catch(err => {
                message.channel.send("There was an error");
                logger
                    ? logger.log(message, [
                          "$authorTag$",
                          " in ",
                          "$channelTag$",
                          ":\t",
                          "kill failed.",
                      ])
                    : null;
            });
        }
    }
);

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
