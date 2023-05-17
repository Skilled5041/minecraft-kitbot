import { Bot } from "../../customTypes.js";
import { Client, WebhookClient } from "discord.js";

export interface ChatTrigger {
    name: string;
    description: string;
    trigger: (bot: Bot, message: string) => boolean;
    run: (bot: Bot, message: string, discordBot: Client, webhookClient: WebhookClient,) => void;
}
