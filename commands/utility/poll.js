module.exports = {
    aliases: ['vote'],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const upvote = message.guild.emojis.cache.find(emoji => emoji.name === 'upvote');
        message.react(upvote);
        setTimeout(() => {
            const downvote = message.guild.emojis.cache.find(emoji => emoji.name === 'downvote');
            message.react(downvote);
        })

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
