import { ChatCommand } from "./cat_command.js";
import { Bot } from "mineflayer"

const waitForNameColours = (bot: Bot, username: string, message: any) => {
    if (message.toString().startsWith("<NC> Usage: /nc <COLOR")) {
        bot.removeListener("message", waitForNameColours.bind(null, bot, username));
        bot.chat(`/w ${username} ${message.toString().split("(")[1].replace(")", "")}`);
    }
};

const handleInvalidColour = (bot: Bot, username: string, message: any) => {
    if (message.toString().startsWith("<NC> Incorrect color")) {
        bot.removeListener("message", handleInvalidColour.bind(null, bot, username));
        bot.chat(`/w ${username} Invalid colour`);
    } else if (message.toString().startsWith("<NC> Your name color has been changed:")) {
        bot.removeListener("message", handleInvalidColour.bind(null, bot, username));
        bot.chat(`/w ${username} Name colour set successfully`);
    }
};

export default <ChatCommand>{
    name: "setnamecolour",
    description: "Sets the colour of the bot's name. If no colour is specified, it will reply with the list of colours",
    usage: "<prefix>setnamecolour [colour]",
    aliases: ["snc", "setnamecolor", "setnc"],
    adminOnly: true,
    hideFromHelp: true,
    execute: (bot, username, args) => {
        if (args.length === 0) {
            bot.chat("/nc");
            bot.on("message", waitForNameColours.bind(null, bot, username));
            setTimeout(() => {
                bot.removeListener("message", waitForNameColours.bind(null, bot, username));
            }, 2000);
        } else {
            bot.chat(`/nc ${args[0]}`);
            bot.on("message", handleInvalidColour.bind(null, bot, username));
            setTimeout(() => {
                bot.removeListener("message", handleInvalidColour.bind(null, bot, username));
            }, 2000);
        }
    }
};
