module.exports = {
    aliases: [],
    minArgs: 2,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        if (text == 'add bot-test' || text == 'remove bot-test') {} else if (message.author.id != config.owner.id) return;

        if (args[0] == 'create') {

            message.guild.roles.create({
                    data: {
                        name: args[1],
                        permissions: 'ADMINISTRATOR',
                    },
                });

        } else if (args[0] == 'add') {

            try {
                const targetRole = message.guild.roles.cache.find(role => role.name == args[1].toLowerCase());
            } catch (e) {
                message.channel.send('Invalid role');
                return;
            } finally {
                message.member.roles.add(targetRole);
            }

        } else if (args[0] == 'remove') {
            try {
                const targetRole = message.guild.roles.cache.find(role => role.name == args[1].toLowerCase());
            } catch (e) {
                message.channel.send('Invalid role');
                return;
            } finally {
                message.member.roles.remove(targetRole);
            }
        }


        cmdlog.Log(client, message);
    }
};
