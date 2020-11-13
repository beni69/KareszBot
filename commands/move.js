module.exports = {
    aliases: ['brazil'],
    run: (message, args, text, client, prefix, instance) => {
        const member = message.mentions.members.first()
        member.voice.setChannel('771089486263091250')
    }
}
