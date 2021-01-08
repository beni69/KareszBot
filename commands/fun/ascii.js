module.exports = {
    aliases: [],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const figlet = require("figlet");

        figlet(text, (err, data) => {
            if (err) {
                message.reply("Error while creating ascii");
                console.log("Karesz > Eror while creating ascii");
                console.dir(err);
                return;
            }
            const ascii = `\`\`\`\n${data}\n\`\`\``;
            if (ascii.length > 2000) {
                message.reply(
                    "Sorry, that message would be over the discord character limit (2000 chars)"
                );
                console.log("Karesz > Eror while sending ascii");
            } else message.channel.send(ascii);
        });

        // cmdlog.Log(client, message);
    },
};