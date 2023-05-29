import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";
import { WebhookClient } from "discord.js";
import { ChatMessage } from "$src/events/message.js";

type handle = (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: string) => boolean | Promise<boolean>;

export const waitForMinecraftReply = async (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, timeout: number, handle: handle): Promise<void> => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            minecraftBot.removeListener("message", func);
            reject("Timed out");
        }, timeout);

        const resolvePromise = () => {
            clearTimeout(timeoutId);
            minecraftBot.removeListener("message", func);
            resolve();
        };

        const func = async (message: ChatMessage) => {
            const shouldUnregister = await handle(minecraftBot, discordClient, webhookClient, message.toString());
            if (await shouldUnregister) {
                resolvePromise();
            }
        };

        minecraftBot.on("message", func);
    });
};
