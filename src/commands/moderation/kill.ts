import { Command } from "@beni69/cmd";
import { GuildChannel, GuildMember } from "discord.js";
import { saveRoles } from ".";

const KILLCHANCE = 6.9;

export const command = new Command(
    {
        names: ["kill", "kick"],
        description: "haha funi",
        cooldown: "24h",
        minArgs: 1,
        maxArgs: 1,
        noDM: true,
        noSlash: true,
        react: "⚰",
        blacklist: ["824954982989299722"],
    },
    async ({ trigger, client, handler, logger }) => {
        if (trigger.isSlash()) return;
        const message = trigger.source;
        if (!message.mentions.users.size) {
            await trigger.reply("Next time mention someone you dumbass");
            return false;
        }

        const sk = selfKill();

        const target = (
            sk ? message.member : message.mentions.members?.first()
        ) as GuildMember;
        const mention = message.mentions.members?.first() as GuildMember;

        //* unkillable
        // server owner
        if (
            handler.getOpts.admins.has(target.id) ||
            target.id == message.guild?.ownerID
        ) {
            await trigger.reply(
                sk
                    ? "You would have been killed, if you weren't the server owner. However, the cooldown still applies."
                    : "It's impossible to kill the server owner. However, the cooldown still applies."
            );
            return;
        }
        // server booster
        if (target.premiumSinceTimestamp) {
            await trigger.reply(
                sk
                    ? "You would have been killed, if you weren't boosting the server. However, the cooldown still applies."
                    : "That person is boosting the server, and I won't kill them. However, the cooldown still applies."
            );
            return false;
        }
        // self (bot)
        if (target.id === client.user?.id) {
            await trigger.reply("I wont kill myself");
            return false;
        }
        // higher roles than bot
        if (!target.manageable) {
            await trigger.reply(
                "I don't have the permissions to kill that user."
            );
            return false;
        }

        await saveRoles(target);

        await target
            .kick(
                sk
                    ? `Tried to kill ${mention.user.tag} but failed.`
                    : `Killed by ${message.author.tag}`
            )
            .catch(err =>
                logger
                    ? logger.log(trigger, [
                          "$authorTag$",
                          " in ",
                          "$channelTag$",
                          ":\t",
                          `${sk ? "self" : ""} kill failed.`,
                      ])
                    : null
            );

        if (sk) {
            message.author
                .send(
                    `So unlucky! You shot yourself and have been kicked from **${message.guild?.name}**.\nThere was a 1 in ${KILLCHANCE} chance of that happening. Better luck next time! 🤷‍♂️`
                )
                .catch(err => {});
            await trigger.reply(
                `${message.author.tag} looked inside the barrel of their own gun to see if it works. They *(obviously)* died. Such a dumbass.`
            );
        } else {
            target.user
                .send(
                    `You have just been brutally murdered by ${message.author.tag}`
                )
                .catch(err => {});
        }

        const invite = await (
            message.guild?.channels.cache.first() as GuildChannel
        )?.createInvite({
            maxUses: 1,
            unique: false,
            reason: `Invite for ${target.user.tag} after they were killed by ${message.author.tag}`,
        });

        target.user
            .send(`Dont worry tho, you can come back.\n${invite}`)
            .catch(err => {});
    }
);

const selfKill = () => Math.floor(Math.random() * KILLCHANCE) == 0;
