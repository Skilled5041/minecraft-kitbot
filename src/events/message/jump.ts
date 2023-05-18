import { ChatTrigger } from "./message_trigger.js";

export default <ChatTrigger>{
    name: "jump",
    description: "Makes the bot jump.",
    trigger:(bot, message) => message.trim() === "Walk a block to speak in chat.",
    execute: async (bot) => {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 1000);
    }
};
