import { ChatTrigger } from "./message_trigger.js";
import { isBridgeMessage } from "$src/utils/chat_message_regexes.js";

export default <ChatTrigger>{
    name: "WYSI",
    description: "Responds when a message has 727.",
    trigger: (minecraftBot, discordClient, webhookClient, message) => message.includes("727"),
    execute: (minecraftBot, discordClient, webhookClient, message) => {
        if (isBridgeMessage.test(message.toString())) return;
        if (message.toString() === "727 WYSI") return;
        minecraftBot.safeChat("727 WYSI");
    }
};
