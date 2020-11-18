module.exports = {
    aliases: ['mod', 'admin'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        const adminRole = message.guild.roles.cache.find(role => role.name === 'Admin')
        if (!message.mentions.users.size) {

            if (message.author.id == config.owner.id) {
                const targetMember = message.guild.members.cache.get(message.author.id)
                targetMember.roles.add(adminRole)

            } else {

                message.channel.send("You can't OP yourself.")
            }

        } else {

            const target = message.mentions.users.first()
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.roles.add(adminRole)
        }

        cmdlog.Log(client, message);
    }
}
