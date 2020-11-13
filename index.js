const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const config = require('./config.json');

const client = new DiscordJS.Client()

client.on('ready', () => {
    console.log('Bot ready');
  // Initialize WOKCommands
  new WOKCommands(client, 'commands', 'features').setDefaultPrefix(config.prefix)
})

client.login('Nzc2NTI2NTc0NDgwNTIzMjc1.X62Kug.0g7kZDBLBTZ5218Bg1aBkm4KZQE')
