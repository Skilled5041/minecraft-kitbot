import { ChatTrigger } from "./message_trigger.js";
import { Bot } from "mineflayer"

export default <ChatTrigger>{
    name: "WYSI",
    description: "Responds when a message has 727.",
    trigger: (bot, message: string) => message.includes("727"),
    execute: (bot: Bot, message) => {
        if (message.toString() === "727 WYSI") return;
        bot.chat("727 WYSI");
    }
};
