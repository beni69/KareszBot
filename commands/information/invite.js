module.exports = {
    aliases: [],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        message.channel.send(
            "Invite me to other servers:\nhttps://bit.ly/karesz"
        );
        // message.channel.send('https://bit.ly/3ngmM5G');

        cmdlog.Log(client, message);
    },
};
