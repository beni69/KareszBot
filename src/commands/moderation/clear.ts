import { Command } from "@beni69/cmd";
import { TextChannel } from "discord.js";
import { promisify } from "util";
const wait = promisify(setTimeout);

export const command = new Command(
    {
        names: ["clear", "c"],
        description: "delete some messages from this channel",
        options: [
            {
                name: "amount",
                description: "the number of messages to delete (MAX: 99)",
                type: "INTEGER",
                required: true,
            },
        ],
        noDM: true,
        ephemeral: true,
    },
    async ({ trigger, args, logger }) => {
        let amount = parseInt(args[0]);
        if (trigger.isClassic()) amount++;
        const deleted = await (trigger.channel as TextChannel).bulkDelete(
            amount,
            true
        );

        if (logger) {
            deleted.delete(trigger.id);

            //? why is there no Collection.reduceRight()
            const str = deleted.reduce(
                (acc, item) => (acc ? `${item.content}, ` + acc : item.content),
                ""
            );
            logger.send(`Deleted ${deleted.size} messages:\t${str}`);
        }

        await trigger.reply({
            content: `Done! successfully deleted ${amount} messages.`,
            failIfNotExists: false,
        });

        if (trigger.isClassic()) {
            await wait(2000);
            const reply = await trigger.fetchReply();
            reply && (await reply.delete());
        }

        return true;
    }
);
