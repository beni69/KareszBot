module.exports = {
    aliases: [],
    minArgs: 0,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        if (args[0] == 'all') {

            message.guild.members.cache.forEach(member => {
                //guard clause, early return
                if(member.id === message.member.id || !member.voice.channel) return;
                member.voice.setChannel(config.voice.brazil);
            });
        } else if (!message.mentions.users.size) {

            const target = message.guild.members.cache.get(message.author.id)
            target.voice.setChannel(config.voice.brazil)

        } else {

            const member = message.mentions.members.first()
            member.voice.setChannel(config.voice.brazil)
        }
        message.react('🇧🇷')

        cmdlog.Log(client, message);
    }
}
