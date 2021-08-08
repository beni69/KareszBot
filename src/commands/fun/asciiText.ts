import { Command } from "@beni69/cmd";
import figlet from "figlet";
import { code } from ".";

const fonts = figlet.fontsSync().map(f => {
    return { name: f, value: f };
});

export const command = new Command(
    {
        names: ["asciiText", "ascii", "figlet"],
        description: "turn your text into ascii",
        options: [
            {
                name: "text",
                description: "the text to convert",
                type: "STRING",
                required: true,
            },
            {
                name: "font",
                description: "the font to use",
                type: "STRING",
                // choices: fonts,
                required: false,
            },
        ],
        argvAliases: { fonts: ["F"], font: ["f"] },
    },
    ({ trigger, argv, text }) => {
        // help menu (sort of)
        if (argv.getBoolean("fonts")) {
            trigger.reply(
                "Find the list of all available fonts here: <https://krsz.me/asciifonts>"
            );
            return false;
        }
        const input = trigger.isClassic() ? text : argv.getString("text", true);

        const font: any = argv.getString("font") || "Standard";

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
                if (err || !res) {
                    console.error(err);
                    trigger.reply("Error while creating ascii");
                    return false;
                }

                const fig = trimEnds(res);

                if (fig.length > 2000)
                    return trigger.reply(
                        "Sorry, that ascii would be over 2000 characters. (The message limit on discord)"
                    );

                trigger.reply(code(fig));
            }
        );
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
