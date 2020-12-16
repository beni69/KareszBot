module.exports = {
    aliases: ['c', 'cc'],
    minArgs: 1,
    maxArgs: 1,
    run: async (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');

        await message.channel.bulkDelete(1, true).catch(err => console.error(err));
        const amount = parseInt(args[0]) + 1;

        let deleted = [];
        for (let i = 1; i < amount; i++) {
            await message.channel.messages.fetch({ limit: 1 })
                .then(message => {
                    const item = Array.from(message)[0][1];
                    deleted.push(item.content);
                })
                .catch(err => console.error(err));
            await message.channel.bulkDelete(1, true).catch(err => console.error(err));
        }
        console.log(deleted);

        cmdlog.Log(client, message, `<@${message.member.id}> in **${message.guild.name}**:    Deleted ${deleted.length} messages: **${deleted.reverse().join('**, **')}**`);
    }
};
