module.exports = {
    aliases: ['vote'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const log = require('../../features/commandLog.js');
        const upvote = message.guild.emojis.cache.find(emoji => emoji.name === 'upvote');
        message.react(upvote);
        setTimeout(() => {
            const downvote = message.guild.emojis.cache.find(emoji => emoji.name === 'downvote');
            message.react(downvote);
        })

        const log = require('../../features/commandLog.js');
    }
}
