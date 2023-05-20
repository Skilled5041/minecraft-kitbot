import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";
import { sanitise, filterRegexes, filterStrings } from "../utils/safety.js";
import fs from "fs";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("Sends a message to the 0b0t chat")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The message to send to the chat")
                .setMinLength(1)
                .setMaxLength(215)
                .setRequired(true)),

    async execute(minecraftBot, discordClient, interaction) {
        let message = interaction.options.getString("message") ?? "";
        console.log(message);
        message = sanitise(message);

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

        const success = minecraftBot.safeChat(`[${interaction.user.tag}] ${message}`);
        if (success) {
            await interaction.reply({content: "Message sent.", ephemeral: true});
        } else {
            await interaction.reply({content: "Failed, please wait a bit before trying again.", ephemeral: true});
        }

        fs.appendFile("./logs/chat_bridge.txt", `[${interaction.user.tag}] ${message}\n`, (err) => {
            if (err) console.error(err);
        });
    }
};
