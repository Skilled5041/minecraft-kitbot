import { ChatCommand } from "./cat_command.js";

export default <ChatCommand>{
    name: "discordNitroCode",
    usage: "<prefix>discordNitroCode",
    description: "Sends a discord nitro code",
    aliases: ["nitro", "nitroCode"],
    execute: (bot) => {
        const uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let token = "";

        for (let i = 0; i < 4; i++) {
            token += uppercaseCharacters.charAt(Math.floor(Math.random() * uppercaseCharacters.length));
        }
        token += "-";

        for (let i = 0; i < 5; i++) {
            token += uppercaseCharacters.charAt(Math.floor(Math.random() * uppercaseCharacters.length));
        }
        token += "-";

        for (let i = 0; i < 4; i++) {
            token += uppercaseCharacters.charAt(Math.floor(Math.random() * uppercaseCharacters.length));
        }
        token += "-";

        for (let i = 0; i < 5; i++) {
            token += uppercaseCharacters.charAt(Math.floor(Math.random() * uppercaseCharacters.length));
        }

        bot.chat(`Here is a discord nitro code: ${token}`);
    }
}
