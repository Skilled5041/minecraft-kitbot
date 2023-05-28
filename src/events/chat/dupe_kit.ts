import { ChatCommand } from "./chat_command.js";
import { takeItemFromContainer } from "$src/utils/containers.js";
import { waitForMinecraftReply } from "$src/utils/waitForMinecraftReply.js";

export default <ChatCommand>{
    name: "dupekit",
    description: "Gives you a dupe kit.",
    usage: "<prefix>dupekit",
    whitelistedOnly: true,
    cooldown: 10000,
    aliases: ["dupe", "dk"],
    execute: async (minecraftBot, discordClient, webhookClient, username) => {
        await takeItemFromContainer(minecraftBot, ["chest", "trapped_chest"]);
        minecraftBot.safeChat(`/tpa ${username}`);
        await waitForMinecraftReply(minecraftBot, discordClient, webhookClient, 5000, (minecraftBot, discordClient, webhookClient, message) => {
            if (message.startsWith("Teleported to")) {
                minecraftBot.safeChat("/kill");
                return true;
            }
            return false;
        }).catch(() => {});
    }
};
