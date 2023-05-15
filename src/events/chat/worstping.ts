import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "worstping",
    description: "Shows the player with the worst ping on the server.",
    usage: "<prefix>bestping",
    aliases: ["wp"],
    run: (bot, username, args) => {
        const worstPing = Object.values(bot.players).reduce((prev, curr) => {
            return prev.ping > curr.ping ? prev : curr;
        });

        bot.chat(`The player with the worst ping is ${worstPing.username} with a ping of ${worstPing.ping}`);

    }
};
