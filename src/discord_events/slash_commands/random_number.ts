import { SlashCommand } from "./slash_command.js";
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("random-number")
        .setDescription("Generates a random number between a specified range.")
        .addIntegerOption(option => option.setName("min").setDescription("The minimum number.").setRequired(true))
        .addIntegerOption(option => option.setName("max").setDescription("The maximum number.").setRequired(true))
        .addIntegerOption(option => option.setName("decimals").setDescription("The number of decimals to round to. Set negative to round the number.").setRequired(false)),

    async execute(minecraftBot, discordClient, interaction) {
        const min = interaction.options.getInteger("min") ?? 0;
        const max = interaction.options.getInteger("max") ?? 10;


        if (min > max) {
            return await interaction.reply("Min cannot be greater than max.");
        }

        const decimals = interaction.options.getInteger("decimals") ?? 0;

        const random = Math.random() * (max - min) + min;
        const rounded = Math.round(random * Math.pow(10, decimals)) / Math.pow(10, decimals);

        let colour: ColorResolvable;
        switch (true) {
            case rounded < 0:
                colour = "Red";
                break;
            case rounded > 0:
                colour = "Green";
                break;
            default:
                colour = "White";
        }

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(colour)
                .setDescription(`The random number is ${rounded}.`)
            ]
        });
    }
};
