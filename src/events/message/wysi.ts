import { ChatTrigger } from "./message_trigger.js";
import { Bot } from "mineflayer";
import { isBridgeMessage } from "../../utils/chat_message_regexes.js";

export default <ChatTrigger>{
    name: "WYSI",
    description: "Responds when a message has 727.",
    trigger: (bot, message: string) => message.includes("727"),
    execute: (bot: Bot, message) => {
        if (isBridgeMessage.exec(message.toString())) return;
        if (message.toString() === "727 WYSI") return;
        bot.chat("727 WYSI");
    }
};
