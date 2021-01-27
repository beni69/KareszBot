module.exports = {
    aliases: [],
    minArgs: 1,
    maxArgs: 1,
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const fs = require("fs");

        if (Math.floor(Math.random() * config.killchance) == 0) {
            const target = message.author;
            const targetMember = message.guild.members.cache.get(target.id);
            if (
                target.id == config.owner.id ||
                target.id == message.guild.ownerID
            )
                return;
            saveRoles(target);
            targetMember.kick().catch(e => {
                return cmdlog.Log(
                    client,
                    message,
                    `<@${message.member.id}> in **${message.guild.name}**:    Self kill failed: ${message.content}\nError message: ${e}`
                );
            });
            target.send(
                `So unlucky! You shot yourself and have been kicked from **${message.guild.name}**.\nThere was a 1 in ${config.killchance} chance of that happening. Better luck next time! 🤷‍♂️`
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
        }

        saveRoles(target);
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

        function saveRoles(user) {
            const member = message.guild.members.cache.get(user.id);
            const roles = member.roles.cache.array();
            let rolesx = [];
            roles.forEach(item => {
                if (
                    item.name != "@everyone" &&
                    !(user.bot && item.name == user.username)
                ) {
                    rolesx.push(item.id);
                }
            });
            const rolesJSON = JSON.stringify(rolesx);
            if (!fs.existsSync("./victims")) fs.mkdirSync("./victims");
            fs.writeFileSync(`./victims/${user.tag}.json`, rolesJSON);
        }
    },
};
