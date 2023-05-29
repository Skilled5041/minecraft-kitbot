import { ChatCommand } from "./chat_command.js";
import { waitForMinecraftReply } from "$src/utils/wait_for_minecraft_reply.js";

export default <ChatCommand>{
    name: "setnamecolour",
    description: "Sets the colour of the bot's name. If no colour is specified, it will reply with the list of colours",
    usage: "<prefix>setnamecolour [colour]",
    aliases: ["snc", "setnamecolor", "setnc"],
    adminOnly: true,
    hideFromHelp: true,
    async execute(minecraftBot, discordClient, webhookClient, username, args) {
        if (args.length === 0) {
            minecraftBot.safeChat("/nc");
            await waitForMinecraftReply(minecraftBot, discordClient, webhookClient, 2000, (minecraftBot, discordClient, webhookClient, message) => {
                if (message.startsWith("<NC> Usage: /nc <COLOR")) {
                    minecraftBot.safeChat(`/w ${username} ${message.toString().split("(")[1].replace(")", "")}`);
                    return true;
                }
                return false;
            }).catch(() => {});
        } else {
            minecraftBot.safeChat(`/nc ${args[0]}`);
            await waitForMinecraftReply(minecraftBot, discordClient, webhookClient, 2000, (minecraftBot, discordClient, webhookClient, message) => {
                if (message.startsWith("<NC> Your name color has been changed:")) {
                    minecraftBot.safeChat(`/w ${username} Name colour set successfully`);
                    return true;
                } else if (message.toString().startsWith("<NC> Incorrect color")) {
                    minecraftBot.safeChat(`/w ${username} Invalid colour`);
                    return true;
                }
                return false;
            }).catch(() => {});
        }
    }
};
