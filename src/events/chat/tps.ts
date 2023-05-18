import { ChatCommand } from "./cat_command.js";
import { Bot } from "mineflayer"

export default <ChatCommand>{
    name: "tps",
    description: "Gets the server's TPS (maybe inaccurate).",
    usage: "<prefix>tps",
    execute: (bot: Bot) => {
        if (!bot.getTps) return bot.chat("Error getting TPS.");
        bot.chat(`The server's TPS is ${bot.getTps()}`);
    }
}
