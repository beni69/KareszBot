import { Command } from "@beni69/cmd";
import { MessageEmbed } from "discord.js";
import Music from ".";

export const command = new Command(
    { names: "player", noDM: true, react: "👌" },
    ({ message, args }) => {
        const queue = Music.get(message.guild!);
        const dp = queue.getDispatcher;
        // let loopLvl = 0;

        switch (args[0]) {
            case "clear":
            case "destroy":
                queue.Destroy();
                break;

            case "pause":
                if (queue.Pause() === null) return false;
                break;
            case "resume":
                if (queue.Resume() === null) return false;
                break;

            case "volume":
                if (!args[1]) {
                    message.channel.send(
                        makeEmb("", `The volume is at ${dp?.volume! * 100}%`)
                    );
                    return false;
                } else {
                    let v: number;
                    if (/^(reset)|(default)$/.test(args[1])) v = 1;
                    v = parseFloat(args[1]) / 100;
                    if (isNaN(v)) {
                        message.channel.send(
                            makeEmb("", "Give me a number, dummy!")
                        );
                        return false;
                    }
                    dp?.setVolume(v);
                }
                break;

            case "earrape":
                if (dp?.volume != 8) dp?.setVolume(8);
                else dp.setVolume(1);
                break;

            case "loop":
                switch (queue.loopLvl) {
                    // no loop -> queue
                    case 0:
                        queue.loopLvl = 1;
                        message.channel.send(
                            makeEmb(
                                "",
                                "Loop mode: **queue**\n*WIP: currently does nothing.*"
                            )
                        );
                        break;

                    // queue -> song
                    case 1:
                        queue.loopLvl = 2;
                        message.channel.send(
                            makeEmb("", "Loop mode: **song**")
                        );
                        break;

                    // song -> no loop
                    case 2:
                        queue.loopLvl = 0;
                        message.channel.send(
                            makeEmb("", "Loop mode: **none**")
                        );
                        break;
                }
                break;

            default:
                break;
        }
    }
);

function makeEmb(title: string, desc: string, color?: string) {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor(color || "BLURPLE")
        .setTimestamp();
}