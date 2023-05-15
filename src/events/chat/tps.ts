import { ChatCommand } from "./chatCommand.js";
import { Bot } from "../../customTypes.js";

export default <ChatCommand>{
    name: "tps",
    description: "Gets the server's TPS (maybe inaccurate).",
    usage: "<prefix>tps",
    run: (bot: Bot) => {
        if (!bot.getTps) return bot.chat("Error getting TPS.");
        bot.chat(`The server's TPS is ${bot.getTps()}`);
    }
}
