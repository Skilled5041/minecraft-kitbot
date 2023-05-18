import { Bot } from "mineflayer";
import { Client, ColorResolvable, EmbedBuilder, WebhookClient } from "discord.js";
import { isDeathMessage, isPlayerMessage } from "../utils/chat_message_regexes.js";

// TODO: Make this use regexes
const filter = (message: String) => {
    if (message.trim().endsWith("wants to teleport to you.")) return true;
    if (message.trim().includes("Type /tpy ") && message.trim().includes(" to accept or /tpn")) return true;
    if (message.trim().includes("Request from") && message.trim().includes(" accepted!")) return true;
    if (message.trim().includes(" teleported to you!")) return true;
    if (message.trim().includes("Request sent to:")) return true;
    if (message.trim().startsWith("To ") && message.trim().endsWith(": Type /tpy Solarion2 to receive the dupe kit.")) return true;
    if (message.trim().startsWith("Your request sent to ") && message.trim().endsWith(" was denied!")) return true;
};

export default (bot: Bot, discordBot: Client, webhookClient: WebhookClient, message: any) => {
    const isPlayer = isPlayerMessage.exec(message.toString().trim());

    if (isPlayer && message.toString().trim() != "") {
        const username = isPlayer[1];
        const headImage = `https://cravatar.eu/helmhead/${username}/128.png`;
        message = message.toString().replace(isPlayerMessage, "").trim();
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(message);

        void webhookClient.send({
            username: username,
            avatarURL: headImage,
            embeds: [embed]
        });
    } else if (message.toString().trim() != "" && !filter(message.toString())) {
        // ppcat image
        const avatarURL = "https://i.imgur.com/NhWCV30.png";
        const isPlayerDeathMessage = isDeathMessage.exec(message.toAnsi().trim());
        let colour: ColorResolvable = "Orange";
        if (isPlayerDeathMessage) {
            // Black
            colour = 0x000000;
        }
        const embed = new EmbedBuilder()
            .setColor(colour)
            .setDescription(message.toString().trim());

        void webhookClient.send({
            username: "[Server]",
            avatarURL: avatarURL,
            embeds: [embed]
        });
    }

    for (const trigger of bot.messageTriggers?.values() ?? []) {
        if (trigger.trigger(bot, message.toString())) {
            trigger.execute(bot, message.toString(), discordBot, webhookClient);
        }
    }
}
;
