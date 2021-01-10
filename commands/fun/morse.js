module.exports = {
    aliases: [],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const figlet = require("figlet");

        figlet.text(
            text,
            {
                font: "Morse",
                horizontalLayout: "default",
                verticalLayout: "fitted",
                width: 140,
                whitespaceBreak: true,
            },
            (err, data) => {
                if (data == "") return;
                let ascii = `\`\`\`${data}\`\`\``;
                if (ascii.length > 2000) {
                    message.channel.send("Message to long!");
                    return;
                }
                message.channel.send(ascii);
            }
        );

        cmdlog.Log(client, message);
    },
};
