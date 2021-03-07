import { EmojiIdentifierResolvable, Message } from "discord.js";

export function React(message: Message, emoji: EmojiIdentifierResolvable) {
    message.react(emoji); // i honestly thought this would be harder but ok
}
