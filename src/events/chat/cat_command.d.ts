import { Bot } from "mineflayer"
import { Client, WebhookClient } from "discord.js";

export interface ChatCommand {
    name: string;
    description: string;
    usage: string;
    hideFromHelp?: boolean;
    aliases?: string[];
    adminOnly?: boolean;

    execute: (bot: Bot, username: string, args: string[], discordBot: Client, webhookClient: WebhookClient) => void;
}
