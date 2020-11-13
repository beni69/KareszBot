module.exports = {
    aliases: ['cc'],
    run: (message, args, text, client, prefix, instance) => {
        const amount = parseInt(args[0]) + 1;
        message.channel.bulkDelete(amount);
    }
}
