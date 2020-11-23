module.exports = {
    aliases: [],
    minArgs: 0,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        if (message.author.id == config.mate) {
            cmdlog.Log(client, message, `<@${message.author.id}> tried to run ${message.content}`);
            return;
        }

        const brazil = client.guilds.cache.get(config.nyf).channels.cache.get(config.voice.brazil);

        if (args[0] == 'all' || args[0] == '@everyone') {

            message.guild.members.cache.forEach(member => {
                //guard clause, early return
                if (!member.voice.channel) return;
                member.voice.setChannel(brazil);
            });
        } else if (!message.mentions.users.size) {

            const target = message.guild.members.cache.get(message.author.id);
            if (!target.voice.channel) {
                message.channel.send('You need to be in a voice channel first.');
                return;
            }
            target.voice.setChannel(brazil);

        } else {

            const member = message.mentions.members.first();
            if (!member.voice.channel) {
                message.channel.send('Your friend needs to be in a voice channel first.');
                return;
            }
            member.voice.setChannel(brazil);
        }
        message.react('🇧🇷');

        cmdlog.Log(client, message);
    }
};
