module.exports = {
    aliases: ['vote'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        const upvote = client.emojis.cache.get('776837718797320234');
        message.react(upvote);
        setTimeout(() => {
            const downvote = client.emojis.cache.get('776836162102099979');
            message.react(downvote);
        })

        cmdlog.Log(client, message);
    }
}
