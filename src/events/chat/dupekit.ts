import { ChatCommand } from "./chatCommand.js";
import { waitForTPAccept } from "../../utils/teleport.js";
import { takeItemFromContainer } from "../../utils/containers.js";

export default <ChatCommand> {
    name: "dupekit",
    description: "Gives you a dupe kit.",
    usage: "<prefix>dupekit",
    aliases: ["dupe", "dk"],
    run: async (bot, username) => {
        await takeItemFromContainer(bot, ["chest", "trapped_chest"]);
        bot.chat(`/tpa ${username}`);
        bot.chat(`/w ${username} Type /tpy ${bot.username} to receive the dupe kit.`);
        bot.on("message", waitForTPAccept.bind(null, bot));
    }
};
