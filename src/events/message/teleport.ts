import { ChatTrigger } from "./message_trigger.js";

export default <ChatTrigger>{
    name: "Tpa Accept",
    description: "Accepts a Tpa request from an admin.",
    trigger: (minecraftBot, message) => {
        return minecraftBot.admins
            ?.map(admin => admin.toLowerCase())
            ?.some((admin) => message.toLowerCase().
            includes(`type /tpy ${admin} to accept or /tpn ${admin} to deny.`));
    },
    execute: (minecraftBot, message) => {
        minecraftBot.safeChat(`/tpy ${message.split(" ")[2]}`);
    }
};
