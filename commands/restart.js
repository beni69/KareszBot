module.exports = {
    aliases: [],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../config.json');
        if (message.author.id == config.owner.id) {
            process.exit();
        }
    }
}
