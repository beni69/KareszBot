import { Command } from "@beni69/cmd";

export const command = new Command(
    { names: ["nickname", "name"], react: "👌" },
    ({ message, text }) => {
        message.member?.setNickname(text);
    }
);
