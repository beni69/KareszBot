module.exports = {
    aliases: ['admin'],
    minArgs: 0,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        const adminRole = message.guild.roles.cache.find(role => role.name == 'Admin')
        const memberAuthor = message.guild.members.cache.get(message.author.id)

        if (!message.mentions.users.size) {

            if (message.author.id == config.owner.id) {
                memberAuthor.roles.add(adminRole)

            } else {

                message.channel.send("You can't OP yourself.")
            }

        } else if (memberAuthor.hasPermission('ADMINISTRATOR')) {

            const target = message.mentions.users.first()
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.roles.add(adminRole)
        } else {
            message.channel.send("You don't have the permissons to run that command")
        }

        cmdlog.Log(client, message);
    }
}
