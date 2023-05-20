import { ChatCommand } from "./chat_command.js";

export default <ChatCommand>{
    name: "catfact",
    description: "Sends a random cat fact.",
    usage: "<prefix>catfact",
    execute: async (minecraftBot) => {
        const response = await fetch("https://catfact.ninja/fact");
        const data = await response.json();
        const fact = data.fact;

        minecraftBot.safeChat(fact);
    }
}
