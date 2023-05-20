import { Bot } from "mineflayer";
import { Player } from "mineflayer";
import { Client, EmbedBuilder, TextChannel, WebhookClient } from "discord.js";
import { MineflayerEvent } from "./mineflayer_events.js";

export default <MineflayerEvent>{
    name: "playerLeft",
    async handler(minecraftBot: Bot, discordClient: Client, webhookClient: WebhookClient, player: Player) {
        if (player.username === minecraftBot.username) return;
        if (Date.now() - (minecraftBot.startTime ?? 32515012887) < 10000) return;
        const bridgeChannel = discordClient.channels.cache.get("1108054000789626951") as TextChannel | undefined;
        await bridgeChannel?.send({
            embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`**${player.username}** left the game.`)]
        });
    }
};
