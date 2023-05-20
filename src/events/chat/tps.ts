import { ChatCommand } from "./chat_command.js";
import { Bot } from "mineflayer"

export default <ChatCommand>{
    name: "tps",
    description: "Gets the server's TPS (maybe inaccurate).",
    usage: "<prefix>tps",
    execute: (minecraftBot: Bot) => {
        if (!minecraftBot.getTps) return minecraftBot.chat("Error getting TPS.");
        minecraftBot.safeChat(`The server's TPS is ${minecraftBot.getTps()}`);
    }
}
