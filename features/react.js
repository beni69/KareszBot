exports.Simple = function (message, name) {
    try{
        const emoji = message.guild.emojis.cache.find(emoji => emoji.name === name);
        message.react(emoji);
    } catch(err) {}
};
