import { ChatTrigger } from "./messageTrigger.js";
import { Bot } from "../../customTypes.js";

export default <ChatTrigger>{
    name: "WYSI",
    description: "Responds when a message has 727.",
    trigger: (bot, message: string) => message.includes("727"),
    run: (bot: Bot, message) => {
        if (message.toString() === "727 WYSI") return;
        bot.chat("727 WYSI");
    }
};
