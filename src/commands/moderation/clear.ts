import { Command } from "@beni69/cmd";
import { TextChannel } from "discord.js";

export const command = new Command(
    { names: ["clear", "c"] },
    async ({ message, args, logger }) => {
        const amount = parseInt(args[0]);
        const deleted = await (message.channel as TextChannel).bulkDelete(
            amount + 1,
            true
        );

        if (logger) {
            deleted.delete(message.id);

            //? why is there no Collection.reduceRight()
            const str = deleted.reduce(
                (acc, item) =>
                    acc ? `**${item.content}**, ` + acc : `**${item.content}**`,
                ""
            );
            console.log(str);
            logger.send(`Deleted ${deleted.size} messages:\t${str}`);
        }
    }
);
