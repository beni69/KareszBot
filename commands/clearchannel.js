module.exports = {
    aliases: ['cc', 'ccc'],
    minArgs: 1,
    maxArgs: 1,
    run: (message, args, text, client, prefix, instance) => {
        const amount = parseInt(args[0]) + 1
        message.channel.bulkDelete(amount)
    }
}
