import { ChatTrigger } from "./message_trigger.js";

export default <ChatTrigger>{
    name: "Tpa Accept",
    description: "Accepts a Tpa request from an admin.",
    trigger: (bot, message) => {
        return bot.admins
            ?.map(admin => admin.toLowerCase())
            ?.some((admin) => message.toLowerCase().
            includes(`type /tpy ${admin} to accept or /tpn ${admin} to deny.`));
    },
    execute: async (bot, message) => {
        bot.chat(`/tpy ${message.split(" ")[2]}`);
    }
};
