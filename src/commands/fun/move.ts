import { Command, Utils } from "@beni69/cmd";
import {
    Channel,
    GuildChannel,
    GuildMember,
    Snowflake,
    VoiceChannel,
} from "discord.js";

export const command = new Command(
    {
        names: "move",
        description: "move someone to a different voice channel",
        options: [
            {
                name: "user",
                description: "the user to move",
                type: "USER",
                required: true,
            },
            {
                name: "channel",
                description: "the channel to move to",
                type: "CHANNEL",
                required: true,
            },
        ],
        ephemeral: true,
        react: "👌",
    },
    async ({ trigger, args, argv, text }) => {
        let target: GuildMember | undefined | null;
        let ch: Channel | undefined;
        if (trigger.isClassic()) {
            target = trigger.guild?.members.resolve(
                Utils.resolveUser(args[0]) as Snowflake
            );
            ch =
                trigger.guild?.channels.cache.find(
                    c => c.name === (text.replace(args[0], "").trim() as any)
                ) || undefined;
        } else {
            target = argv.getMember("user") as GuildMember;
            ch = argv.getChannel("channel") as GuildChannel;
        }

        if (!target) {
            trigger.reply("user not found");
            return false;
        } else if (!ch || !("bitrate" in ch)) {
            trigger.reply("channel not found");
            return false;
        }
        const channel = ch as VoiceChannel;

        // move everyone
        if (args[0] === "all" || args[0] === "@everyone") {
            trigger.guild?.members.cache
                .filter(m => !!m.voice.channel)
                .forEach(m => m.voice.setChannel(channel));
        }
        // move the @
        else {
            try {
                await target.voice.setChannel(channel);
                trigger.isSlash() && (await trigger.reply("✅"));
            } catch (err) {
                trigger.reply("an error occured");
            }
        }
    }
);
