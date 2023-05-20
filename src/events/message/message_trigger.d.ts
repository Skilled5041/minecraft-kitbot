import { Bot } from "mineflayer"
import { Client, WebhookClient } from "discord.js";

export interface ChatTrigger {
    name: string;
    description: string;
    trigger: (minecraftBot: Bot, message: string) => boolean;
    execute: (minecraftBot: Bot, message: string, discordClient: Client, webhookClient: WebhookClient,) => Promise<void> | void;
}
