import { ChatCommand } from "./cat_command.js";

export default <ChatCommand>{
    name: "catfact",
    description: "Sends a random cat fact.",
    usage: "<prefix>catfact",
    execute: async (bot) => {
        const response = await fetch("https://catfact.ninja/fact");
        const data = await response.json();
        const fact = data.fact;

        bot.chat(fact);
    }
}
