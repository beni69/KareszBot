module.exports = {
	aliases: ["c", "cc"],
	minArgs: 1,
	maxArgs: 1,
	run: async (message, args, text, client, prefix, instance) => {
		const config = require("../../config.json");
		const cmdlog = require("../../features/commandLog.js");

		await message.channel
			.bulkDelete(1, true)
			.catch(err => console.error(err));

		const amount = parseInt(args[0]);
		let ray = await message.channel.messages.fetch({limit: amount});
		ray = Array.from(ray);
		let deleted = [];
		await ray.forEach(item => {
			deleted.push(item[1].content);
		});

		await message.channel
			.bulkDelete(amount, true)
			.catch(err => console.error(err));

		cmdlog.Log(
			client,
			message,
			`<@${message.member.id}> in **${
				message.guild.name
			}**:    Deleted ${amount} messages: **${deleted
				.reverse()
				.join("**, **")}**`
		);
	},
};
