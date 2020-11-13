const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')

const client = new DiscordJS.Client()
const prefix = '.'

client.on('ready', () => {
  // Initialize WOKCommands
  new WOKCommands(client, 'commands', 'features').setDefaultPrefix(prefix)
})

client.login(process.env.BOT_TOKEN)
