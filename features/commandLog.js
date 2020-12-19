exports.Log = function (client, message, c) {
    const config = require("../config");
    if (c) {
        client.guilds.cache
            .get(config.testServer)
            .channels.cache.get(config.logChannel)
            .send(c);
        console.log(
            `Karesz: Running command: ${message.content}, requested by: ${message.author.tag}\nProvided log message: ${c}`
        );
    } else {
        client.guilds.cache
            .get(config.testServer)
            .channels.cache.get(config.logChannel)
            .send(
                `<@${message.member.id}> in **${message.guild.name}**:    ${message.content}`
            );
        console.log(
            `Karesz: Running command: ${message.content}, requested by: ${message.author.tag}`
        );
    }
};
