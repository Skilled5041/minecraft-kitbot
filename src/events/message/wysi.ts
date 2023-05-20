import { ChatTrigger } from "./message_trigger.js";
import { isBridgeMessage } from "../../utils/chat_message_regexes.js";
import { ExtendedMinecraftBot } from "../../modified_clients.js";

export default <ChatTrigger>{
    name: "WYSI",
    description: "Responds when a message has 727.",
    trigger: (minecraftBot, message: string) => message.includes("727"),
    execute: (minecraftBot: ExtendedMinecraftBot, message) => {
        if (isBridgeMessage.test(message.toString())) return;
        if (message.toString() === "727 WYSI") return;
        minecraftBot.safeChat("727 WYSI");
    }
};
