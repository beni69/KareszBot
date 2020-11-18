const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const config = require('./config.json');
const cmdlog = require('./features/commandLog');

const client = new DiscordJS.Client()

client.on('ready', () => {
    // client.guilds.cache.get(config.testServer).channels.cache.get(config.logChannel).send("I'm ready!")
    console.log('Bot ready');
    // Initialize WOKCommands
    new WOKCommands(client, 'commands', 'features').setDefaultPrefix(config.prefix)
})

client.on('message', message => {

    if (message.content.toLowerCase().includes('pog')) {
        const pog = message.guild.emojis.cache.find(emoji => emoji.name === 'pog');
        message.react(pog);
    } else if (message.content.toLowerCase().includes('karesz')) {
        const karesz = message.guild.emojis.cache.find(emoji => emoji.name === 'karesz');
        message.react(karesz);
    } else if (message.content.toLowerCase() == '!snake') {
        const SnakeGame = require('./commands/snakeGame');
        cmdlog.Log(client, message);
        const snakeGame = new SnakeGame(client);
        snakeGame.newGame(message);
    }
})

client.login(process.env.BOT_TOKEN)
