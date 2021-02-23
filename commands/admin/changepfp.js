module.exports = {
    aliases: [],
    minArgs: 0,
    maxArgs: -1,
    run: ({ message, args, text, client, prefix, instance }) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");

        if (message.author.id != config.owner.id) return;
        const image = text || message.attachments.first().url;
        console.log(image);
        client.user.setAvatar(image);

        cmdlog.Log(client, message);
    },
};
