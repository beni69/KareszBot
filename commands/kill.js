module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const target = message.mentions.users.first()
        if (target.id=='376793727794020354') {
            message.channel.send("I'm sorry, you can't kill god")
        } else {
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.kick()
        }

    }
}
