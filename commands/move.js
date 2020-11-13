module.exports = {
    aliases: ['brazil'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        if (!message.mentions.users.size) {

            const target = message.guild.members.cache.get(message.author.id)
            target.voice.setChannel(config.brazil)

        } else {

            const member = message.mentions.members.first()
            member.voice.setChannel(config.brazil)
        }
    }
}
