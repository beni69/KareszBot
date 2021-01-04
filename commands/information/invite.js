module.exports = {
    aliases: [],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");

        message.channel.send(`Invite me to other servers:\n${config.inv}`);

        cmdlog.Log(client, message);
    },
};
