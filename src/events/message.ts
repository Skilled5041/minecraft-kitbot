import { Bot } from "../customTypes.js";
import { Client, WebhookClient } from "discord.js";

export default (bot: Bot, discordBot: Client, webhookClient: WebhookClient, message: any) => {
    console.log(message.toAnsi());

    // Check if message is from the server or from a player
    const isPlayerRegex = /^<([a-zA-Z0-9_]+)>/;
    const isPlayer = isPlayerRegex.exec(message.toString().trim());

    if (isPlayer && message.toString().trim() != "") {
        const username = isPlayer[1];
        const headImage = `https://cravatar.eu/helmhead/${username}/128.png`;
        message = message.toString().replace(isPlayerRegex, "").trim();
        void webhookClient.send({
            content: message.toString(),
            username: username,
            avatarURL: headImage,
        });
    } else if (message.toString().trim() != "") {
        // ppcat image
        const avatarURL = "https://i.imgur.com/NhWCV30.png";
        void webhookClient.send({
            content: message.toString(),
            username: "[Server]",
            avatarURL: avatarURL,
        });
    }

    for (const trigger of bot.messageTriggers?.values() ?? []) {
        if (trigger.trigger(bot, message.toString())) {
            trigger.run(bot, message.toString(), discordBot, webhookClient);
        }
    }
}
;
