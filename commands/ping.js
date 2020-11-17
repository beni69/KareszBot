module.exports = {
    aliases: ['p'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        message.channel.send(`🏓  ${Date.now()-message.createdTimestamp}ms`);
    }
}
