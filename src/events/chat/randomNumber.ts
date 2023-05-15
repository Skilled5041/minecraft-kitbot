import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "randomnumber",
    description: "Sends a random number between <min> and <max> (inclusive).",
    usage: "<prefix>randomnumber <min> <max>",
    aliases: ["random", "randomnum", "rand", "randnum"],
    run: (bot, _, args) => {
        if (args.length < 2) {
            bot.chat("Please provide a minimum and maximum number.");
            return;
        }
        // Check if the arguments are numbers
        if (isNaN(Number(args[0])) || isNaN(Number(args[1]))) {
            bot.chat("Please provide only valid numbers.");
            return;
        }

        const min = Math.min(Number(args[0]), Number(args[1]));
        const max = Math.max(Number(args[0]), Number(args[1]));

        let random = Math.random() * (max - min + 1) + min;

        if (min % 1 === 0 && max % 1 === 0 && !args[0].includes(".") && !args[1].includes(".")) {
            random = Math.floor(random);
        }

        return bot.chat(`The random number is ${random}.`);
    }
};
