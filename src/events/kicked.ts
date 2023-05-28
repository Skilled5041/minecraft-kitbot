import { MineflayerEvent } from "./mineflayer_events.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";
import { WebhookClient } from "discord.js";

export default <MineflayerEvent>{
    name: "kicked",
    handler: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, reason: string, loggedIn: boolean) => {
        console.log(`Kicked from server for reason "${reason}"`);
    }
};
