import { Events, WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../modified_clients.js";

export interface DiscordEvent {
    event: Events;
    handler: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient) => void | Promise<void>;
    register?: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient) => void | Promise<void>;
}
