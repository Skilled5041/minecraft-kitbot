import { ChatCommand } from "./chat_command.js";

export default <ChatCommand>{
    name: "ping",
    description: "Shows the ping of the specified player. Shows the users ping if the player is not specified",
    usage: "<prefix>ping [player]",
    execute: (minecraftBot, discordClient, webhookClient, username, args) => {
        if (args.length === 0) {
            return minecraftBot.safeChat(`Your ping is ${minecraftBot.players[username]?.ping ?? "unknown"}`);
        }

        args[0] = args[0].toLowerCase();
        const player = Object.keys(minecraftBot.players).find(player => player.toLowerCase() === args[0]);
        if (!player) {
            return minecraftBot.safeChat(`Player not found.`);
        }

        minecraftBot.safeChat(`${player}'s ping is ${minecraftBot.players[player]?.ping ?? "unknown"}`);

    }
};
