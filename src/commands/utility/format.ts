import { Command } from "@beni69/cmd";
import { Message } from "discord.js";
import fetch from "node-fetch";
import { extname } from "path";
import { format, getSupportInfo, Options } from "prettier";

export const command = new Command(
    { names: "format", description: "format code", noSlash: true },
    async ({ trigger }) => {
        if (trigger.isSlash()) return;
        const message = trigger.source;
        const isAttachment = !!message.attachments.size;

        const data = isAttachment
            ? await fromAttachment(message as unknown as Message) // typescript is really dumb
            : fromMessage(message as unknown as Message);

        if (!data?.lang) {
            return false;
        }

        let res;
        try {
            res = format(data.code, {
                ...styleOptions,
                filepath: `karesz.${data.lang}`,
            });
        } catch (err: any) {
            console.error({ name: err.name, message: err.message });

            let msg = "";
            switch (err.name) {
                case "SyntaxError":
                    msg =
                        "The code contains a syntex error and could not be formatted.";
                    break;

                default:
                    msg = "An unknown error occured.";
                    break;
            }

            message.reply(msg);

            return false;
        }

        isAttachment
            ? message.reply({
                  files: [
                      {
                          attachment: Buffer.from(res),
                          name: `formatted.${data.lang}`,
                      },
                  ],
              })
            : message.reply(codeBlock(res, data.lang));

        return true;
    }
);

const fromMessage = (
    message: Message
): { code: string; lang?: string } | undefined => {
    const str = message.content;

    const getLangRx = /(?<=```)(\w|\d|\+)+(?=.+```)/s;
    const getCodeRx = /(?<=```(\w|\d|\+)+\s).+(?=```)/s;

    const lang = getLangRx.exec(str)?.[0]?.trim();
    const code = getCodeRx.exec(str)?.[0]?.trim();

    if (!code || !lang) {
        message.channel.send("Please provide a codeblock with a language.");
        return;
    } else if (!isExtSupported("." + lang)) {
        message.channel.send("File type or language isn't supported.");
        return;
    }

    return { code, lang };
};

const fromAttachment = async (
    message: Message
): Promise<{ code: string; lang?: string } | undefined> => {
    const a = message.attachments.first()!;

    const ext = extname(a.url);

    console.log({ lang: ext });

    if (!isExtSupported(ext)) {
        message.channel.send("File type or language isn't supported.");
        return;
    }

    const data = await fetch(a.url);
    const code = await data.text();

    return { code, lang: ext.replace(".", "") };
};

const codeBlock = (str: string, lang = "") =>
    "```" + lang + "\n" + str + "\n```";

const isExtSupported = (lang: string) =>
    getSupportInfo()
        .languages.map(l => l.extensions?.includes(lang))
        .includes(true);

const styleOptions: Options = {
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "es5",
    bracketSpacing: true,
    arrowParens: "avoid",
};
