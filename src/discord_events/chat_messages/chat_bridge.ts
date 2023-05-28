import { DiscordChatTrigger } from "$src/discord_events/chat_messages/discord_chat_message.js";
import { logToFile } from "$src/utils/log_errors.js";
import { filterRegexes, filterStrings, sanitise } from "$src/utils/safety.js";

export default <DiscordChatTrigger>{
    name: "chat_bridge",
    description: "Sends a message to 0b0t chat",
    trigger(minecraftBot, discordClient, webhookClient, message) {
        return message.channelId === "1108054000789626951";
    },
    async execute(minecraftBot, discordClient, webhookClient, message) {

        if (!discordClient.lastUserMessageTime.has(message.author.id)) {
            discordClient.lastUserMessageTime.set(message.author.id, 0);
        }

        if (Date.now() - (discordClient.lastUserMessageTime.get(message.author.id) ?? 0) < 1500) {
            return await message.reply("Please wait a bit before sending another bridge message.");
        }
        discordClient.lastUserMessageTime.set(message.author.id, Date.now());

        let msg = message.content;
        logToFile(msg, "./logs/chat_bridge.txt");

        msg = sanitise(msg);

        for (const filterString of filterStrings) {
            if (msg.includes(filterString)) {
                return await message.react("❌");
            }
        }

        for (const filterRegex of filterRegexes) {
            if (filterRegex.test(msg)) {
                return await message.react("❌");
            }
        }

        const success = minecraftBot.safeChat(`[${message.author.tag}] ${msg}`);

        if (success) {
            await message.react("✅");
        } else {
            await message.react("❌");
        }
    }
};
