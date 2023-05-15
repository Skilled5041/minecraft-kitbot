import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "coinflip",
    description: "Flips a coin.",
    usage: "<prefix>coinflip",
    aliases: ["flipcoin", "coin", "flip", "cf"],
    run: async (bot) => {
        const coin = Math.floor(Math.random() * 2) == 0 ? "heads" : "tails";

        bot.chat(`The coin landed on ${coin}.`);
    }
};
