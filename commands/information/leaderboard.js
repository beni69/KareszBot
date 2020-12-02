module.exports = {
    aliases: ['lb'],
    minArgs: 0,
    maxArgs: -1,
    run: (message, args, text, client, prefix, instance) => {
        const config = require('../../config.json');
        const cmdlog = require('../../features/commandLog.js');
        const fetch = require('node-fetch');

        const opts = {
            headers: {
                cookie: `session=${config.aocKey}`
            }
        };
        // fetch('https://api.github.com/users/octocat')
        fetch('https://adventofcode.com/2020/leaderboard/private/view/1022157.json', opts)
            .then(res => res.json())
            .then((board) => {
                // console.log('Output: ', board);

                const boardArray = Object.entries(board.members).map(x => x.pop());
                let boardSorted = boardArray.sort((a, b) => {
                    if (a.local_score < b.local_score) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                // console.log(boardSorted);

                let content = '';
                boardSorted.forEach((item, i) => {
                    content = content.concat(`**${item.name}**: Score **${item.local_score}**, Stars: **${item.stars}⭐**\n`);
                });

                const embed = {
                    color: 'DARK_GREEN',
                    title: 'Advent of Code Leaderboard',
                    description: content.trim(),
                    fields: [],
                    timestamp: new Date(),
                    footer: {
                        text: message.author.tag
                    }
                };
                message.channel.send({ embed:embed });

            }).catch(err => console.error(err));

        cmdlog.Log(client, message);
    }
};
