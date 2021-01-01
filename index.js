const Discord = require("discord.js");
const WOKCommands = require("wokcommands");
const config = require("./config.json");
const cmdlog = require("./features/commandLog");
const react = require("./features/reaction.js");
require("dotenv").config();

const client = new Discord.Client();

client.on("ready", async () => {
    new WOKCommands(client, "commands", "features").setDefaultPrefix(
        process.env.BOT_PREFIX
    );
    status("happy 2015");

    cmdlog.Log(client, null, `<@${config.owner.id}> I'm ready`, true);
});

client.on("message", message => {
    if (message.content.toLowerCase().includes("pog")) {
        react.Simple(client, message, "pog");
    } else if (message.content.toLowerCase().includes("karesz")) {
        react.Simple(client, message, "karesz");
    } else if (message.content.toLowerCase() == config.prefix + "snake") {
        const SnakeGame = require("./commands/fun/snakeGame");
        cmdlog.Log(client, message);
        const snakeGame = new SnakeGame(client);
        snakeGame.newGame(message);
    }
});

const status = (msg, type = 0) => {
    client.user.setPresence({
        activity: {
            name: msg,
            type: type,
        },
    });
};

client.login(process.env.BOT_TOKEN);
