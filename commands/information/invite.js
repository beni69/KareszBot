module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        message.channel.send('Use this link to invite the bot to other servers:\nhttps://bit.ly/3ngmM5G');
        // message.channel.send('https://bit.ly/3ngmM5G');

        cmdlog.Log(client, message);
    }
}
