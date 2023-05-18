import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("Sends a message to the 0b0t chat")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The message to send to the chat")
                .setMinLength(1)
                .setMaxLength(222)
                .setRequired(true)),

    execute(bot, client, interaction) {
        const message = interaction.options.getString("message") ?? "";
        bot.chat(`[${interaction.user.tag}] ${message}`);

        void interaction.reply({content: "Message sent!", ephemeral: true});
    }
};
