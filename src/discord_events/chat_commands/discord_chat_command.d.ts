import { Message, WebhookClient } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../../modified_clients.js";

export interface DiscordChatCommand {
    name: string;
    description: string;
    usage: string;
    hideFromHelp?: boolean;
    aliases?: string[];
    adminOnly?: boolean;
    cooldown?: number;
    whitelistedOnly?: boolean;

    execute: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: Message, args: string[]) => Promise<void> | void;
}
