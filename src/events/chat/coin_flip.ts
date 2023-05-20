import { ChatCommand } from "./chat_command.js";

export default <ChatCommand>{
    name: "coinflip",
    description: "Flips a coin.",
    usage: "<prefix>coinflip",
    aliases: ["flipcoin", "coin", "flip", "cf"],
    execute: async (minecraftBot) => {
        const coin = Math.floor(Math.random() * 2) == 0 ? "heads" : "tails";

        minecraftBot.safeChat(`The coin landed on ${coin}.`);
    }
};
