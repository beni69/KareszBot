module.exports = {
    aliases: [],
    minArgs: 2,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        if (message.author.id != config.owner.id) return;

        if (args[0] == 'create') {
            message.guild.roles.create({
                    data: {
                        name: args[1],
                        permissions: 'ADMINISTRATOR',
                    },
                });
        } else if (args[0] == 'add') {
            const rolee = message.guild.roles.cache.find(role => role.name == args[1]);
            message.member.roles.add(rolee);
        } else if (args[0] == 'remove') {
            const rolee = message.guild.roles.cache.find(role => role.name == args[1]);
            message.member.roles.remove(rolee);
        }


        cmdlog.Log(client, message);
    }
};
