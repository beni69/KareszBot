module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        if (message.guild.emojis.cache.find(emoji => emoji.name === 'karesz')) {
            console.log('van karesz :)');
        } else {
            console.log('no karesz :(');
        }
        // const karesz = message.guild.emojis.cache.find(emoji => emoji.name === 'karesz');
        // message.react(karesz);
        // message.channel.send('https://cdn.discordapp.com/emojis/776413600117030913.png?v=1')

        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> ran: ${message.content}`)
    }
}
