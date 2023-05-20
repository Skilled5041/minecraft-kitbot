import { ChatCommand } from "./chat_command.js";
import { waitForTPAccept } from "../../utils/teleport.js";
import { takeItemFromContainer } from "../../utils/containers.js";

export default <ChatCommand> {
    name: "dupekit",
    description: "Gives you a dupe kit.",
    usage: "<prefix>dupekit",
    aliases: ["dupe", "dk"],
    execute: async (minecraftBot, username) => {
        await takeItemFromContainer(minecraftBot, ["chest", "trapped_chest"]);
        minecraftBot.safeChat(`/tpa ${username}`);
        minecraftBot.on("message", waitForTPAccept.bind(null, minecraftBot));
    }
};
