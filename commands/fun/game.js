module.exports = {
    aliases: ["kareszgame"],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const cmdlog = require("../../features/commandLog.js");
        const KareszGame = require("../../features/KareszGame.js");
        const yargs = require("yargs/yargs");
        const argv = yargs(text).argv;

        if (argv.h || argv.help) {
            return message.channel.send(`
**Usage:**
${prefix}game *[options]*

**Options:**
-h - Help menu
-c
--coop - Bot won't ignore reactions from other players *(default: off)*
-W *[width]*
--width *[width]* - Set game board width, maximum is 15 *(default: 15)*
-H *[height]*
--height *[height]* - Set game board height, maximum is 10 *(default: 10)*`);
        }

        let gameArgs = {
            coop: argv.c || argv.coop || false,
            WIDTH: argv.W || argv.width || 15,
            HEIGHT: argv.H || argv.height || 10,
        };

        const game = new KareszGame(client, message, gameArgs);
        game.newGame();

        cmdlog.Log(client, message);
    },
};
