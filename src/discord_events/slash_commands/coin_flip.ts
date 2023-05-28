import { SlashCommand } from "./slash_command.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("coin-flip")
        .setDescription("Flips a coin."),

    async execute(minecraftBot, discordClient, interaction) {
        const coin = Math.floor(Math.random() * 2);
        if (coin === 1) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("The coin landed on heads.")
                    .setColor("Gold")
                ]
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("The coin landed on tails.")
                    .setColor("Grey")
                ]
            });
        }
    }
};
