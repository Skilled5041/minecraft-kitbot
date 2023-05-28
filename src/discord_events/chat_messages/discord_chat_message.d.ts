import { Message, WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$/modified_clients.js";

export interface DiscordChatTrigger {
    name: string;
    description: string;
    trigger: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: Message) => boolean;
    execute: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: Message) => Promise<void> | void;
}
