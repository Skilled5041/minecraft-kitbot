import { WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../../modified_clients.js";

export interface ChatCommand {
    name: string;
    description: string;
    usage: string;
    hideFromHelp?: boolean;
    aliases?: string[];
    adminOnly?: boolean;
    cooldown?: number;
    whitelistedOnly?: boolean;

    execute: (minecraftBot: ExtendedMinecraftBot, username: string, args: string[], discordClient: ExtendedDiscordClient, webhookClient: WebhookClient) => Promise<void> | void;
}
