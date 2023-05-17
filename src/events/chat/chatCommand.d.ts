import { Bot } from "../../customTypes.js";
import { Client, WebhookClient } from "discord.js";

export interface ChatCommand {
    name: string;
    description: string;
    usage: string;
    hideFromHelp?: boolean;
    aliases?: string[];
    adminOnly?: boolean;

    run: (bot: Bot, username: string, args: string[], discordBot: Client, webhookClient: WebhookClient) => void;
}
