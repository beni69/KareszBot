module.exports = {
    name: '',
    description: "sends a link to invite the bot to other servers",
    execute(message, args){
        //the code itself
        message.channel.send('Use this link to invite the bot to other servers:')
        message.channel.send('https://bit.ly/3ngmM5G');
    }
}
