module.exports = {
    aliases: [],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const figlet = require("figlet");

        let input = text.replace(/`|\*/gi, "");

        figlet.text(
            input,
            {
                horizontalLayout: "default",
                verticalLayout: "fitted",
                width: 140,
                whitespaceBreak: true,
            },
            (err, data) => {
                if (err) {
                    message.reply("Error while creating ascii");
                    console.log("Karesz > Eror while creating ascii");
                    console.dir(err);
                    return;
                }
                if (data == "") return;

                let ascii = `\`\`\`\n${data}\n\`\`\``;
                if (ascii.length > 2000) {
                    message.reply(
                        "Sorry, that message would be over the discord character limit (2000 chars)"
                    );
                    console.log("Karesz > Eror while sending ascii");
                } else {
                    ascii = trimEnds(ascii);
                    message.channel.send(ascii);
                }
            }
        );

        cmdlog.Log(client, message);

        function trimEnds(x) {
            return x
                .split(/\n/)
                .map(function (line) {
                    return line.replace(/\s+$/, "");
                })
                .join("\n");
        }
    },
};
