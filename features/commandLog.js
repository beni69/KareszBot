// trying to make command logging easier

exports.CommandLog = function (client, message) {
    const config = require('../config');
    // trying to make command logging easier
    client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${message.member.id}> in ${message.guild.name}: ${message.content}`)
};
