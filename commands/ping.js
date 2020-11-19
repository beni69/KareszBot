module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        const cmdlog = require('../features/commandLog.js');
        message.channel.send(`🏓  ${client.ws.ping}ms`);

        cmdlog.Log(client, message);
    }
}
