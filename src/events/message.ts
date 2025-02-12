import { BotEvents } from "mineflayer";
import { ColorResolvable, EmbedBuilder, WebhookClient } from "discord.js";
import { isDeathMessage, isPlayerMessage } from "$src/utils/chat_message_regexes.js";
import { MineflayerEvent } from "./mineflayer_events.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";
import fs from "fs";
import { ChatTrigger } from "./message/message_trigger.js";
import chalk from "chalk";

export type ChatMessage = Parameters<BotEvents["message"]>[0];

const filter = (message: string) => {
    if (/[a-zA-Z0-9_]{2,16} wants to teleport to you./.test(message)) return true;
    if (/Type \/tpy [a-zA-Z0-9_]{2,16} to accept or \/tpn [a-zA-Z0-9_]{2,16} to deny./.test(message)) return true;
    if (/Request from [a-zA-Z0-9_]{2,16} accepted!/.test(message)) return true;
    if (/[a-zA-Z0-9_]{2,16} teleported to you!/.test(message)) return true;
    if (/Request sent to: [a-zA-Z0-9_]{2,16}/.test(message)) return true;
    if (/Your request was accepted, teleporting to: [a-zA-Z0-9_]{2,16}/.test(message)) return true;
    if (/Teleported to [a-zA-Z0-9_]{2,16}!/.test(message)) return true;
    if (/Your request sent to [a-zA-Z0-9_]{2,16} was denied!/.test(message)) return true;
};

export default <MineflayerEvent>{
    name: "message",

    async register(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient) {

        const messageTriggerFiles: string[] = fs.readdirSync("./src/events/message").filter(file => file.endsWith(".js"));

        for (const file of messageTriggerFiles) {
            const trigger: ChatTrigger = (await import(`./message/${file}`)).default;
            const triggerName = trigger.name;

            minecraftBot.messageTriggers?.set(triggerName, trigger);
            console.log(chalk.greenBright(`Registered message trigger "${triggerName}"`));
        }
    },

    async handler(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: ChatMessage) {
        const isPlayer = isPlayerMessage.exec(message.toString().trim());

        if (isPlayer && message.toString().trim() != "") {
            const username = isPlayer[1];
            const headImage = `https://cravatar.eu/helmhead/${username}/128.png`;

            let colour: ColorResolvable = "Blue";
            if (username.toLowerCase() === minecraftBot.username.toLowerCase()) {
                colour = 0xf1b3ff;
            } else if (username.toLowerCase() === "zskilled_") {
                colour = 0xc7e8ff;
            }

            const messageString = message
                .toString()
                .replace(isPlayerMessage, "")
                .trim()
                .replace("_", "\_");
            const embed = new EmbedBuilder()
                .setColor(colour)
                .setDescription(messageString);

            void webhookClient.send({
                username: username,
                avatarURL: headImage,
                embeds: [embed]
            });
        } else if (message.toString().trim() != "" && !filter(message.toString())) {
            // ppcat image
            const avatarURL = "https://i.imgur.com/NhWCV30.png";
            let colour: ColorResolvable = "Orange";
            if (isDeathMessage.test(message.toAnsi().trim())) {
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

        for (const trigger of minecraftBot.messageTriggers?.values() ?? []) {
            if (trigger.trigger(minecraftBot, discordClient, webhookClient, message.toString())) {
                trigger.execute(minecraftBot, discordClient, webhookClient, message.toString());
            }
        }
    }
};
