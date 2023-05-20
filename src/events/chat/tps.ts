import { ChatCommand } from "./chat_command.js";
import { ExtendedMinecraftBot } from "../../modified_clients.js";

export default <ChatCommand>{
    name: "tps",
    description: "Gets the server's TPS (maybe inaccurate).",
    usage: "<prefix>tps",
    execute: (minecraftBot: ExtendedMinecraftBot) => {
        if (!minecraftBot.getTps) return minecraftBot.chat("Error getting TPS.");
        minecraftBot.safeChat(`The server's TPS is ${minecraftBot.getTps()}`);
    }
}
