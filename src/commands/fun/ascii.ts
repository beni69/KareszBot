import { Command } from "@beni69/cmd";
import figlet from "figlet";

export const command = new Command(
    { names: ["ascii", "figlet"] },
    ({ message, argv }) => {
        // help menu (sort of)
        if (argv.F || argv.fonts)
            return message.channel.send(
                "Find the list of all available fonts here: <https://krsz.me/fonts>"
            );

        const input = argv._.join(" ").replace(/`|\*/gi, "");

        const font: any = argv.f || argv.font || "Standard";

        // @ts-ignore
        figlet.textSync(input, {
            font,
            horizontalLayout: "default",
            verticalLayout: "fitted",
            width: 140,
            whitespaceBreak: true,
        });
    }
);
