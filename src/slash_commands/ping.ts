import { SlashCommand } from "./slash_command.js";
import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns the ping of the bot."),

    async execute(minecraftBot, discordClient, interaction: ChatInputCommandInteraction) {
        const message = await interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle("Pong!")
                .setDescription(`API Latency: ${discordClient.ws.ping > 1 ? `${discordClient.ws.ping} ms` : "calculating..."}\nLatency: calculating...`)
                .setColor("Grey")
            ],
            fetchReply: true
        });

        const latency = message.createdTimestamp - interaction.createdTimestamp;
        let colour: ColorResolvable;
        switch (true) {
            case latency < 250: {
                colour = "Green";
                break;
            }
            case latency < 400: {
                colour = "Yellow";
                break;
            }
            default: {
                colour = "Red";
                break;
            }
        }

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle("Pong!")
                .setDescription(`API Latency: ${discordClient.ws.ping > 1 ? `${discordClient.ws.ping} ms` : "calculating..."}\nLatency: ${latency} ms`)
                .setColor(colour)
            ]
        });
    }
};
