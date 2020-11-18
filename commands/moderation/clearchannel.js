module.exports = {
    aliases: ['ccc'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const log = require('../../features/commandLog.js');
        // const amount = parseInt(args[0]) + 1
        const amount = 100
        let error;
        message.channel.bulkDelete(amount).catch(error)
        console.error(error);

        log.CommandLog(client, message);
    }
}
