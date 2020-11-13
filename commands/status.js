module.exports = {
    aliases: ['changestatus', 'updatestatus'],
    run: (message, args, text, client) => {
        client.user.setPresence({
            activity: {
                name: text,
                type: 0
            }
        })
    }
}
