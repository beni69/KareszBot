module.exports = {
    aliases: ["name"],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        let bruh = false;

        message.member
            .setNickname(text)
            .catch(() => {
                bruh = true;
            })
            .then(() => {
                if (!bruh) message.react("👌");
            });

        cmdlog.Log(client, message);
    },
};
