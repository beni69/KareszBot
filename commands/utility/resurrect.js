module.exports = {
    aliases: ["res"],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const fs = require("fs");

        let roles;
        let user;

        if (!message.mentions.users.first()) user = message.author;
        else user = message.mentions.users.first();
        const member = message.guild.members.cache.get(user.id);

        try {
            roles = require(`../../victims/${user.tag}.json`);
        } catch (error) {
            return message.reply("Sorry bro, couldn't find your roles.");
        }

        member.roles.add(roles).then(message.channel.send("There you go."));

        cmdlog.Log(client, message);
    },
};
