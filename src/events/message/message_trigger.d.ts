import { WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$/modified_clients.js";

export interface ChatTrigger {
    name: string;
    description: string;
    trigger: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: string) => boolean;
    execute: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: string) => Promise<void> | void;
}
