import { ChatCommand } from "./chatCommand.js";

export default <ChatCommand>{
    name: "uptime",
    description: "Shows the bot's uptime.",
    usage: "<prefix>uptime",
    run: async (bot) => {
        const botStartTime = bot.startTime;
        const botUptime = Date.now() - (botStartTime ?? 0);

        let seconds = Math.floor(botUptime / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        seconds %= 60;
        minutes %= 60;
        hours %= 24;

        bot.chat(`I have been online for ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`);
    }
};
