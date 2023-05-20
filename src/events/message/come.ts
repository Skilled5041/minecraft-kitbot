import { ChatTrigger } from "./message_trigger.js";
import { Bot } from "mineflayer"

const waitForAccept = (minecraftBot: Bot, message: any) => {
    if (message.toString().startsWith("Teleported to")) {
        minecraftBot.removeListener("message", waitForAccept.bind(null, minecraftBot));
        minecraftBot.setControlState("jump", true);
        setTimeout(() => {
            minecraftBot.setControlState("jump", false);
        }, 1000);
    }
};

export default <ChatTrigger>{
    name: "come",
    description: "Teleports to an admin.",
    trigger: (minecraftBot, message: string) => {
        return message.trim().includes("whispers: come") &&
            minecraftBot.admins?.some((admin) => message.toLowerCase().includes(`${admin.toLowerCase()} whispers: come`));
    },
    execute: (minecraftBot, message) => {
        minecraftBot.safeChat(`/tpa ${message.split(" ")[0]}`);
        minecraftBot.on("message", waitForAccept.bind(null, minecraftBot));
    }
};
