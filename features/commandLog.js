// trying to make command logging easier

exports.Log = function(client, message, c) {
    const config = require('../config');
    if (c) {
        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(c);
    } else {
        client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> in **${message.guild.name}**:    ${message.content}`);
    }
};
