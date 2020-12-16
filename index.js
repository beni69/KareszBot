const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const config = require('./config.json');
const cmdlog = require('./features/commandLog');
const react = require('./features/reaction.js');
require('dotenv').config();

const client = new DiscordJS.Client();

client.on('ready', () => {
    cmdlog.Log(client, null, `<@${config.owner.id}> I'm ready`);
    console.log('Bot ready');
    // Initialize WOKCommands
    new WOKCommands(client, 'commands', 'features').setDefaultPrefix(config.prefix);
});

client.on('message', message => {

    if (message.content.toLowerCase().includes('pog')) {
        react.Simple(client, message, 'pog');
    } else if (message.content.toLowerCase().includes('karesz')) {
        react.Simple(client, message, 'karesz');
    } else if (message.content.toLowerCase() == config.prefix + 'snake') {
        const SnakeGame = require('./commands/fun/snakeGame');
        cmdlog.Log(client, message);
        const snakeGame = new SnakeGame(client);
        snakeGame.newGame(message);
    }
});

client.login(process.env.BOT_TOKEN);
