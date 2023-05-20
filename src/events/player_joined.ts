import { Player } from "mineflayer";
import { EmbedBuilder, TextChannel, WebhookClient } from "discord.js";
import { MineflayerEvent } from "./mineflayer_events.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../modified_clients.js";

export default <MineflayerEvent>{
    name: "playerJoined",
    async handler(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, player: Player) {
        if (player.username === minecraftBot.username) return;
        if (Date.now() - (minecraftBot.startTime ?? 32515012887) < 10000) return;
        const bridgeChannel = discordClient.channels.cache.get("1108054000789626951") as TextChannel | undefined;
        await bridgeChannel?.send({
            embeds: [new EmbedBuilder()
                .setColor("Green")
                .setDescription(`**${player.username}** joined the game.`)]
        });
    }
};
