module.exports = {
    aliases: [],
    run: (message, args, text, client, prefix, instance) => {
        const target = message.mentions.users.first()
        const targetMember = message.guild.members.cache.get(target.id)
        targetMember.ban()
        
    }
}
