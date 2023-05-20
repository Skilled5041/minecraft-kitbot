import { Bot } from "mineflayer";
import { Client, WebhookClient } from "discord.js";

export interface MineflayerEvent {
    name: string;
    handler: (minecraftBot: Bot, discordClient: Client, webhookClient: WebhookClient) => Promise<void>;
}
