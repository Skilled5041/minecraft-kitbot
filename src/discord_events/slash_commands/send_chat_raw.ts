import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";
import { filterStrings, filterRegexes } from "../../utils/safety.js";

export default <SlashCommand>{
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setDescription("Sends a raw chat message.")
        .setName("send-chat-raw")
        .addStringOption(option => option
            .setName("message")
            .setDescription("The message to send.")
            .setRequired(true)
            .setMinLength(0)
            .setMaxLength(255)
        ),

    async execute(minecraftBot, discordClient, webhookClient, interaction) {
        const message = interaction.options.getString("message", true);

        for (const filterString of filterStrings) {
            if (message.includes(filterString)) {
                return await interaction.reply({content: "Your message contains an illegal string.", ephemeral: true});
            }
        }

        for (const filterRegex of filterRegexes) {
            if (filterRegex.test(message)) {
                return await interaction.reply({content: "Your message contains an illegal string. ", ephemeral: true});
            }
        }

        const success = minecraftBot.safeChat(message);
        if (success) {
            await interaction.reply({content: "Message sent.", ephemeral: true});
        } else {
            await interaction.reply({content: "Failed, please wait a bit before trying again.", ephemeral: true});
        }
    }
};
