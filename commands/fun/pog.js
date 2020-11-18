module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const log = require('../../features/commandLog.js');
        // const pog = message.guild.emojis.cache.find(emoji => emoji.name === 'pog');
        // message.react(pog);
        message.channel.send('https://cdn.discordapp.com/emojis/718439375792242738.png?v=1');

        log.CommandLog(client, message);
    }
}
