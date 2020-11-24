const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const config = require('./config.json');
const cmdlog = require('./features/commandLog');
const react = require('./features/reaction.js');

const client = new DiscordJS.Client();

client.on('ready', () => {
    client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send(`<@${config.owner.id}> I'm ready`);
    console.log('Bot ready');
    // Initialize WOKCommands
    new WOKCommands(client, 'commands', 'features').setDefaultPrefix(config.prefix);
});

client.on('message', message => {

    if (message.content.toLowerCase().includes('pog')) {
        react.Simple(message, 'pog');
    } else if (message.content.toLowerCase().includes('karesz')) {
        react.Simple(message, 'karesz');
    } else if (message.content.toLowerCase() == config.prefix + 'snake') {
        const SnakeGame = require('./commands/fun/snakeGame');
        cmdlog.Log(client, message);
        const snakeGame = new SnakeGame(client);
        snakeGame.newGame(message);
    } else if (message.content.toLowerCase() == 'xd' || message.author.id == config.mate) {
        message.channel.send(config.copypasta.krispy, {
            tts: true
        });
    }
});

client.login(process.env.BOT_TOKEN);
