module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        message.channel.send('https://cdn.discordapp.com/emojis/776413600117030913.png?v=1')

        cmdlog.Log(client, message);
    }
}
