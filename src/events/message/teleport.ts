import { ChatTrigger } from "./message_trigger.js";

export default <ChatTrigger>{
    name: "Tpa Accept",
    description: "Accepts a Tpa request from an admin.",
    trigger: (minecraftBot, discordClient, webhookClient, message) => {
        return minecraftBot.admins
            ?.map((admin: string) => admin.toLowerCase())
            ?.some((admin: string) => message.toLowerCase().
            includes(`type /tpy ${admin} to accept or /tpn ${admin} to deny.`));
    },
    execute: (minecraftBot, discordClient, webhookClient, message) => {
        minecraftBot.safeChat(`/tpy ${message.split(" ")[2]}`);
    }
};
