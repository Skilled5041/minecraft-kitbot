import { ChatCommand } from "./cat_command.js";

export default <ChatCommand>{
    name: "ping",
    description: "Shows the ping of the specified player. Shows the users ping if the player is not specified",
    usage: "<prefix>ping [player]",
    execute: (bot, username, args) => {
        if (args.length === 0) {
            return bot.chat(`Your ping is ${bot.players[username]?.ping ?? "unknown"}`);
        }

        args[0] = args[0].toLowerCase();
        const player = Object.keys(bot.players).find(player => player.toLowerCase() === args[0]);
        if (!player) {
            return bot.chat(`Player not found.`);
        }

        bot.chat(`${player}'s ping is ${bot.players[player]?.ping ?? "unknown"}`);

    }
};
