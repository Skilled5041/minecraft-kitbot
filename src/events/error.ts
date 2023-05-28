import { MineflayerEvent } from "./mineflayer_events.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";
import { WebhookClient } from "discord.js";

export default <MineflayerEvent>{
    name: "error",
    handler: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, err: string) => {
        console.log(err);
    }
};
