const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')

const client = new DiscordJS.Client()

client.on('ready', () => {
  // Initialize WOKCommands
  new WOKCommands(client, 'commands', 'features').setDefaultPrefix('.')
})

client.login(process.env.BOT_TOKEN)
