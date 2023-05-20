import { WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../../modified_clients.js";

export interface ChatTrigger {
    name: string;
    description: string;
    trigger: (minecraftBot: ExtendedMinecraftBot, message: string) => boolean;
    execute: (minecraftBot: ExtendedMinecraftBot, message: string, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient,) => Promise<void> | void;
}
