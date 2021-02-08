module.exports = {
    aliases: ["kareszgame"],
    run: ({message, args, text, client, prefix, instance}) => {
        const config = require("../../config.json");
        const {maxW, maxH} = config.game;
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
--height *[height]* - Set game board height, maximum is 10 *(default: 10)*
-f
--force - Ignore game board size limits *(not recommended)*`);
        }

        let gameArgs = {
            coop: argv.c || argv.coop || false,
            WIDTH: argv.W || argv.width,
            HEIGHT: argv.H || argv.height,
        };
        if (gameArgs.HEIGHT == undefined) gameArgs.HEIGHT = maxH;
        if (gameArgs.WIDTH == undefined) gameArgs.WIDTH = maxW;
        if (
            !(argv.f || argv.force) &&
            (gameArgs.WIDTH > maxW ||
                gameArgs.HEIGHT > maxH ||
                gameArgs.WIDTH < 1 ||
                gameArgs.HEIGHT < 1 ||
                typeof gameArgs.HEIGHT != "number" ||
                typeof gameArgs.WIDTH != "number")
        )
            return message.channel.send(
                `Invalid width/height. Value must be between 1 and the maximum size.\nSee \`${message.content.replace(
                    text,
                    ""
                )} -h\` for more info`
            );

        const p2 = argv.p || argv.player || false;

        console.log(p2);

        if (message.mentions.users.first() && p2)
            gameArgs.p2 = message.guild.members.cache.get(
                p2.substring(3).slice(0, -1)
            );

        if (gameArgs.p2 && gameArgs.coop)
            return message.channel.send(
                "You can't use the coop and player flags at the same time!"
            );

        const game = new KareszGame(client, message, gameArgs);
        game.newGame();

        cmdlog.Log(client, message);
    },
};
