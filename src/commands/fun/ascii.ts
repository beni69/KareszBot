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
        figlet.text(
            input,
            {
                font,
                horizontalLayout: "default",
                verticalLayout: "fitted",
                width: 140,
                whitespaceBreak: true,
            },
            (err, res) => {
                if (err) return message.reply("Error while creating ascii");
                if (!res) return;

                let fig = "```" + res + "```";
                fig = trimEnds(fig);

                if (fig.length > 2000)
                    return message.reply(
                        "Sorry, that ascii would be over 2000 characters. (The message limit on discord)"
                    );

                message.channel.send(fig);
            }
        );

        function trimEnds(str: string) {
            return str
                .split(/\n/)
                .map((line: string) => {
                    return line.replace(/\s+$/, "");
                })
                .join("\n");
        }
    }
);
