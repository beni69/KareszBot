module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const karesz = message.guild.emojis.cache.find(emoji => emoji.name === 'karesz');
        message.react(karesz);
    }
}
