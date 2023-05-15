import { ChatTrigger } from "./messageTrigger.js";
import { Bot } from "../../customTypes.js";

const waitForAccept = (bot: Bot, message: any) => {
    if (message.toString().startsWith("Teleported to")) {
        bot.removeListener("message", waitForAccept.bind(null, bot));
        bot.setControlState("jump", true);
        setTimeout(() => {
            bot.setControlState("jump", false);
        }, 1000);
    }
};

export default <ChatTrigger>{
    name: "come",
    description: "Teleports to an admin.",
    trigger: (bot, message: string) => {
        return message.trim().includes("whispers: come") &&
            bot.admins?.some((admin) => message.toLowerCase().includes(`${admin.toLowerCase()} whispers: come`));
    },
    run: (bot, message) => {
        bot.chat(`/tpa ${message.split(" ")[0]}`);
        bot.on("message", waitForAccept.bind(null, bot));
    }
};
