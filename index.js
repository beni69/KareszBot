const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const config = require('./config.json');

const client = new DiscordJS.Client()

client.on('ready', () => {
    const channel = message.guild.channels.cache.get(config.logChannel)
    channel.send(`bot is online`)
    console.log('Bot ready');
  // Initialize WOKCommands
  new WOKCommands(client, 'commands', 'features').setDefaultPrefix(".")
})

client.on('message', message => {

    if (message.content.toLowerCase().includes('pog')) {
        const pog = message.guild.emojis.cache.find(emoji => emoji.name === 'pog');
        message.react(pog);
    } else if (message.content.toLowerCase().includes('karesz')) {
        const karesz = message.guild.emojis.cache.find(emoji => emoji.name === 'karesz');
        message.react(karesz);
    }
})

client.login(process.env.BOT_TOKEN)
