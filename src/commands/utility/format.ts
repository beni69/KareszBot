import { Command } from "@beni69/cmd";
import { Message } from "discord.js";
import fetch from "node-fetch";
import { extname } from "path";
import { format, getSupportInfo, Options } from "prettier";

export const command = new Command({ names: "format" }, async ({ message }) => {
    const isAttachment = !!message.attachments.size;

    const data = isAttachment
        ? await fromAttachment(message)
        : fromMessage(message);

    if (!data?.lang) {
        return false;
    }

    const res = format(data.code, {
        ...styleOptions,
        filepath: `karesz.${data.lang}`,
    });

    isAttachment
        ? message.channel.send({
              files: [
                  {
                      attachment: Buffer.from(res),
                      name: `formatted.${data.lang}`,
                  },
              ],
          })
        : message.channel.send(codeBlock(res, data.lang));
});

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
    }

    return { code, lang };
};

const fromAttachment = async (
    message: Message
): Promise<{ code: string; lang?: string } | undefined> => {
    const a = message.attachments.first()!;

    const ext = extname(a.url);

    console.log({ lang: ext });

    if (!isLangSupported(ext)) {
        message.channel.send("File type or language isn't supported.");
        return;
    }

    const data = await fetch(a.url);
    const code = await data.text();

    return { code, lang: ext.replace(".", "") };
};

const codeBlock = (str: string, lang = "") =>
    "```" + lang + "\n" + str + "\n```";

const isLangSupported = (lang: string) =>
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
