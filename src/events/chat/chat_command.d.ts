import { Bot } from "mineflayer"
import { Client, WebhookClient } from "discord.js";

export interface ChatCommand {
    name: string;
    description: string;
    usage: string;
    hideFromHelp?: boolean;
    aliases?: string[];
    adminOnly?: boolean;

    execute: (minecraftBot: Bot, username: string, args: string[], discordClient: Client, webhookClient: WebhookClient) => Promise<void> | void;
}
