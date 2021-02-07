module.exports = {
    aliases: ["run"],
    minArgs: 0,
    maxArgs: -1,
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const yargs = require("yargs/yargs");
        const argv = yargs(text).argv;

        if (message.author.id != config.owner.id) return;

        const cmd = argv._.join(" ");

        if (argv.r || argv.raw) eval(cmd);
        else message.channel.send(eval(cmd));

        cmdlog.Log(client, message);
    },
};
