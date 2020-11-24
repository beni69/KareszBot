module.exports = {
    aliases: ['gtfo', 'stop'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        let vc;

        if (!text) {
            if (!message.member.voice.channelID) {
                message.channel.send('Join a voice channel first, dumbass');
                return;
            } else {
                vc = message.member.voice.channel;
                vc.leave();
            }
        } else {
            try {
                vc = client.channels.cache.find(channel => channel.name == text);
                vc.leave();
            } catch (e) {
                message.reply('Invalid channel name');
                return;
            } finally {}
        }

        cmdlog.Log(client, message, `<@${message.member.id}>: Left **${vc.name}** in **${message.guild.name}**`);
    }
};
