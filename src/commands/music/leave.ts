import { Command } from "@beni69/cmd";
import { Music } from ".";

export const command = new Command(
    { names: ["leave", "stop"], noDM: true, react: "👌" },
    ({ message }) => {
        Music.get(message.guild!).Leave();
    }
);
