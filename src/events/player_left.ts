import { Bot } from "mineflayer"
import { Player } from "mineflayer";
import { Client, EmbedBuilder, TextChannel, WebhookClient } from "discord.js";

export default (bot: Bot, discordBot: Client, webhookClient: WebhookClient, player: Player) => {
    if (player.username === bot.username) return;
    if (Date.now() - (bot.startTime ?? 32515012887) < 10000) return;
    const bridgeChannel = discordBot.channels.cache.get("1108054000789626951") as TextChannel | undefined;
    void bridgeChannel?.send({
        embeds: [new EmbedBuilder()
            .setColor("Red")
            .setDescription(`**${player.username}** left the game.`)]
    });

}
