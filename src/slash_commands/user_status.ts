import { SlashCommand } from "./slash_command.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getDiscordUserStatus, getMinecraftUserStatus } from "../utils/user_status.js";
export default <SlashCommand>{
    ownerOnly: false,
    data: new SlashCommandBuilder()
        .setName("user-status")
        .setDescription("Get the whitelist / blacklist of a user")
        .addStringOption(option => option
            .setName("minecraft_username")
            .setRequired(false)
            .setDescription("The Minecraft username of the user to get the status of")
            .setMaxLength(16)
            .setMinLength(2))
        .addUserOption(option => option
            .setName("discord_user")
            .setRequired(false)
            .setDescription("The Discord user to get the status of")),

    async execute(minecraftBot, discordClient, interaction) {
        const discordUser = interaction.options.getUser("discord_user");
        const minecraftUsername = interaction.options.getString("minecraft_username");

        if (!discordUser && !minecraftUsername) {
            return void await interaction.reply({
                content: "Please specify a user to get the status of!",
                ephemeral: true
            });
        }

        if (discordUser && minecraftUsername) {
            return void await interaction.reply({
                content: "Please specify either a Discord user or a Minecraft user, not both!",
                ephemeral: true
            });
        }

        let message = "";

        if (discordUser) {
            const status = await getDiscordUserStatus(minecraftBot, discordClient, discordUser?.id ?? interaction.user.id);
            if (status === "blacklisted") {
                message += `${discordUser?.tag ?? interaction.user.tag} is blacklisted from the bot\n`;
            } else if (status === "whitelisted") {
                message += `${discordUser?.tag ?? interaction.user.tag} is whitelisted to use certain commands \n`;
            } else if (status === "normal") {
                message += `${discordUser?.tag ?? interaction.user.tag} is not whitelisted or blacklisted\n`;
            }
        }

        if (minecraftUsername) {
            const status = await getMinecraftUserStatus(minecraftBot, discordClient, minecraftUsername);
            if (status === "blacklisted") {
                message += `${minecraftUsername} is blacklisted from the bot\n`;
            } else if (status === "whitelisted") {
                message += `${minecraftUsername} is whitelisted to use certain commands \n`;
            } else if (status === "normal") {
                message += `${minecraftUsername} is not whitelisted or blacklisted\n`;
            }
        }

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle("User Status")
                .setDescription(message)
                .setColor("White")]
        });
    }
};
