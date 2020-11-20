module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        message.channel.send('https://cdn.discordapp.com/emojis/718439375792242738.png?v=1');

        cmdlog.Log(client, message);
    }
};
