import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "discordToken",
    usage: "<prefix>discordToken <token>",
    description: "Sends a discord token",
    aliases: ["token"],
    run: (bot) => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const randomCharacter = (characters: string) => characters.charAt(Math.floor(Math.random() * characters.length));

        let token = "";
        token += Math.random() < 0.5 ? "M" : "N";
        for (let i = 0; i < 23; i++) {
            token += randomCharacter(characters);
        }
        token += ".";
        for (let i = 0; i < 6; i++) {
            token += randomCharacter(characters);
        }
        token += ".";
        for (let i = 0; i < 27; i++) {
            token += randomCharacter(characters);
        }
        bot.chat(`Here is a discord token: ${token}`);
    }
};
