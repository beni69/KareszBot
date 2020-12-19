exports.Simple = function (client, message, input, prop = "name") {
	try {
		let emoji;
		if (prop === "name") {
			emoji = message.guild.emojis.cache.find(
				emoji => emoji.name === input
			);
		} else if (prop === "id") {
			emoji = client.emojis.cache.get(input);
		}

		message.react(emoji);
	} catch (err) {
		console.error(err);
	}
};
