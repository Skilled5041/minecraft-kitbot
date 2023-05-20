import { WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../modified_clients.js";

export interface MineflayerEvent {
    name: string;
    handler: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient) => Promise<void>;
}
