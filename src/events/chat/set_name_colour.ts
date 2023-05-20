import { ChatCommand } from "./chat_command.js";
import { Bot } from "mineflayer"

const waitForNameColours = (minecraftBot: Bot, username: string, message: any) => {
    if (message.toString().startsWith("<NC> Usage: /nc <COLOR")) {
        minecraftBot.removeListener("message", waitForNameColours.bind(null, minecraftBot, username));
        minecraftBot.safeChat(`/w ${username} ${message.toString().split("(")[1].replace(")", "")}`);
    }
};

const handleInvalidColour = (minecraftBot: Bot, username: string, message: any) => {
    if (message.toString().startsWith("<NC> Incorrect color")) {
        minecraftBot.removeListener("message", handleInvalidColour.bind(null, minecraftBot, username));
        minecraftBot.safeChat(`/w ${username} Invalid colour`);
    } else if (message.toString().startsWith("<NC> Your name color has been changed:")) {
        minecraftBot.removeListener("message", handleInvalidColour.bind(null, minecraftBot, username));
        minecraftBot.safeChat(`/w ${username} Name colour set successfully`);
    }
};

export default <ChatCommand>{
    name: "setnamecolour",
    description: "Sets the colour of the bot's name. If no colour is specified, it will reply with the list of colours",
    usage: "<prefix>setnamecolour [colour]",
    aliases: ["snc", "setnamecolor", "setnc"],
    adminOnly: true,
    hideFromHelp: true,
    execute: (minecraftBot, username, args) => {
        if (args.length === 0) {
            minecraftBot.safeChat("/nc");
            minecraftBot.on("message", waitForNameColours.bind(null, minecraftBot, username));
            setTimeout(() => {
                minecraftBot.removeListener("message", waitForNameColours.bind(null, minecraftBot, username));
            }, 2000);
        } else {
            minecraftBot.safeChat(`/nc ${args[0]}`);
            minecraftBot.on("message", handleInvalidColour.bind(null, minecraftBot, username));
            setTimeout(() => {
                minecraftBot.removeListener("message", handleInvalidColour.bind(null, minecraftBot, username));
            }, 2000);
        }
    }
};
