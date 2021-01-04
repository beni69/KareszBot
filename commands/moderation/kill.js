module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: 1,
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");

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
        } else if (target.id == client.id) {
            message.channel.send("bruh i wont commit off");
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

        try {
            targetMember.kick();
        } catch (e) {
            message.channel.send("There was an error");
            return cmdlog.Log(
                client,
                message,
                `<@${message.member.id}> in **${message.guild.name}**:    Kill failed: ${message.content}`
            );
        }
        message.react("👌");
        cmdlog.Log(client, message);
    },
};
