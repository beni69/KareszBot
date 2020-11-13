module.exports = {
    aliases: ['changestatus', 'updatestatus'],
    run: (message, args, text, client, prefix, instance) => {
        if (message.author.id=='376793727794020354') {
            client.user.setPresence({
                activity: {
                    name: text,
                    type: 0
                }
            })
        } else {
            message.reply("You don't have permissions to run this command")
        }
    }
}
