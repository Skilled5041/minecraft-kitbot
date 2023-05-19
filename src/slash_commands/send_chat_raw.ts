import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";

export default <SlashCommand>{
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

    execute(bot, client, interaction) {
        if (interaction.user.id !== "313816298461069313") return void interaction.reply("You are not allowed to use this command.");
        const message = interaction.options.getString("message", true);
        bot.chat(message);
        void interaction.reply({content: "Sent message.", ephemeral: true});
    }
};