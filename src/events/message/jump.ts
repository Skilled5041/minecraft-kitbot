import { ChatTrigger } from "./message_trigger.js";

export default <ChatTrigger>{
    name: "jump",
    description: "Makes the bot jump.",
    trigger:(minecraftBot, message) => message.trim() === "Walk a block to speak in chat.",
    execute: (minecraftBot) => {
        minecraftBot.setControlState("jump", true);
        setTimeout(() => minecraftBot.setControlState("jump", false), 1000);
    }
};
