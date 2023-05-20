import { ChatCommand } from "./chat_command.js";

export default <ChatCommand>{
    name: "bestping",
    description: "Shows the player with the best ping on the server.",
    usage: "<prefix>bestping",
    aliases: ["bp"],
    execute: (minecraftBot) => {
        const bestPing = Object.values(minecraftBot.players).reduce((prev, curr) => {
            return prev.ping < curr.ping ? prev : curr;
        });

        minecraftBot.safeChat(`The player with the best ping is ${bestPing.username} with a ping of ${bestPing.ping}`);

    }
};
