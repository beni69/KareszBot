module.exports = {
    aliases: ["changestatus", "updatestatus"],
    run: (message, args, text, client, prefix, instance) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        if (message.author.id == config.owner.id) {
            client.user.setPresence({
                activity: {
                    name: text,
                    type: 0,
                },
            });
            message.react("👌");
        } else {
            message.reply("You don't have permissions to run this command");
        }

        cmdlog.Log(client, message, `Set status to ${text}`);
    },
};
