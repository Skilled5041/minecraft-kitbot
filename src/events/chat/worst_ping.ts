import { ChatCommand } from "./chat_command.js";

export default <ChatCommand>{
    name: "worstping",
    description: "Shows the player with the worst ping on the server.",
    usage: "<prefix>bestping",
    aliases: ["wp"],
    execute: (minecraftBot) => {
        const worstPing = Object.values(minecraftBot.players).reduce((prev, curr) => {
            return prev.ping > curr.ping ? prev : curr;
        });

        minecraftBot.safeChat(`The player with the worst ping is ${worstPing.username} with a ping of ${worstPing.ping}`);

    }
};
