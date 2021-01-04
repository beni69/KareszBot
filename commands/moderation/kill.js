module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: 1,
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");

        if (Math.floor(Math.random() * 69) == 0) {
            const target = message.author;
            if (
                target.id == config.owner.id ||
                target.id == message.guild.ownerID
            )
                return;
            const targetMember = message.guild.members.cache.get(target.id);
            targetMember.kick().catch(e => {
                return cmdlog.Log(
                    client,
                    message,
                    `<@${message.member.id}> in **${message.guild.name}**:    Self kill failed: ${message.content}\nError message: ${e}`
                );
            });
            target.send(
                `So unlucky! You shot yourself and have been kicked from **${message.guild.name}**.\nThere was a 1/69 chance of that happening. Better luck next time! 🤷‍♂️`
            );
            message.channel.send(
                `${target.tag} looked inside the barrel of their own gun to see if it works. They (obviously) died. Such a dumbass.`
            );
            return cmdlog.Log(
                client,
                message,
                `<@${message.member.id}> in **${message.guild.name}**:    Got unlucky and killed themselves: ${message.content}`
            );
        }

        const target = message.mentions.users.first();
        const targetMember = message.guild.members.cache.get(target.id);

        if (target.id == config.owner.id) {
            message.channel.send("I'm sorry, you can't kill god");
            return cmdlog.Log(
                client,
                message,
                `<@${message.member.id}> in **${message.guild.name}**:    ${message.content}`
            );
        } else if (target.id == message.guild.ownerID) {
            message.channel.send("Sadly, you can't kick the server owner");
            return cmdlog.Log(
                client,
                message,
                `<@${message.member.id}> in **${message.guild.name}**:    ${message.content}`
            );
        } else if (target.id == client.user.id) {
            message.channel.send("bruh i wont commit oof");
            return cmdlog.Log(
                client,
                message,
                `<@${message.member.id}> in **${message.guild.name}**:    ${message.content}`
            );
        } else if (target.bot) {
            for (var i = 0; i < targetMember._roles.length; i++) {
                const role = message.guild.roles.cache.find(
                    role => role.id == targetMember._roles[i]
                );
                if (role.name != target.username) {
                    targetMember.roles.remove(role);
                }
            }
        } else {
            for (var i = 0; i < targetMember._roles.length; i++) {
                const role = message.guild.roles.cache.find(
                    role => role.id == targetMember._roles[i]
                );
                targetMember.roles.remove(role).catch(console.error);
            }
        }

        targetMember.kick().catch(e => {
            message.channel.send("There was an error");
            return cmdlog.Log(
                client,
                message,
                `<@${message.member.id}> in **${message.guild.name}**:    Kill failed: ${message.content}\nError message: ${e}`
            );
        });
        message.react("👌");
        cmdlog.Log(client, message);
    },
};
