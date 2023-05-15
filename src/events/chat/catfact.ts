import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "catfact",
    description: "Sends a random cat fact.",
    usage: "<prefix>catfact",
    run: async (bot) => {
        const response = await fetch("https://catfact.ninja/fact");
        const data = await response.json();
        const fact = data.fact;

        bot.chat(fact);
    }
}
