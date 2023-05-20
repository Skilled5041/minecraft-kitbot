import { ChatTrigger } from "./message_trigger.js";

export default<ChatTrigger>{
    name: "slow_down_chat",
    description: "Adds a timeout to the bot to prevent it from spamming the chat.",
    trigger: (minecraftBot, message) => message.trim().includes("Slow down chat or you'll get kicked for spam."),
    execute: (minecraftBot) => {
        minecraftBot.messageInfo.minimumNextMessageTime = Date.now() + 5000;
    }
}
