import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "bestping",
    description: "Shows the player with the best ping on the server.",
    usage: "<prefix>bestping",
    aliases: ["bp"],
    run: (bot, username, args) => {
        const bestPing = Object.values(bot.players).reduce((prev, curr) => {
            return prev.ping < curr.ping ? prev : curr;
        });

        bot.chat(`The player with the best ping is ${bestPing.username} with a ping of ${bestPing.ping}`);

    }
};
