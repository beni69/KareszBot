module.exports = {
    aliases: ["game", "kareszgame"],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const KareszGame = require("../../features/KareszGame.js");
        // const yargs = require("yargs/yargs");
        // const argv = yargs(text).argv;

        const game = new KareszGame(client, message);
        game.newGame();

        cmdlog.Log(client, message);
    },
};
