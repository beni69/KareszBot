module.exports = {
    aliases: ['cc'],
    run: (message, args, text, client, prefix, instance) => {
        message.channel.messages.fetch().then((results) => {
            message.channel.bulkDelete(results)
        })
    }
}
