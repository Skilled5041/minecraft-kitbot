import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";
import supabase from "../utils/supabase.js";
import { usernameToUUID } from "../utils/minecraft_players.js";
import { getDiscordUserStatus, getMinecraftUserStatus } from "../utils/user_status.js";

export default <SlashCommand>{
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Whitelist a user to use the bot")
        .addStringOption(option => option
            .setName("minecraft_username")
            .setRequired(false)
            .setDescription("The Minecraft username of the user to whitelist")
            .setMaxLength(16)
            .setMinLength(2))
        .addUserOption(option => option
            .setName("discord_user")
            .setRequired(false)
            .setDescription("The Discord user to whitelist")),

    async execute(minecraftBot, discordClient, interaction) {
        const discordUser = interaction.options.getUser("discord_user");
        const minecraftUsername = interaction.options.getString("minecraft_username");

        if (!discordUser && !minecraftUsername) {
            return void await interaction.reply({
                content: "Please specify a user to whitelist!",
                ephemeral: true
            });
        }

        if (discordUser && minecraftUsername) {
            return await interaction.reply({
                content: "Please specify only one user to blacklist!",
                ephemeral: true
            });
        }

        if (discordUser) {
            const id = discordUser.id;

            const status = await getDiscordUserStatus(minecraftBot, discordClient, id);
            if (status === "blacklisted") {
                return await interaction.reply({
                    content: `Failed to whitelist user: User is blacklisted`,
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("discord_users_whitelist")
                .insert([
                    {discord_id: id},
                ]);
            if (error) {
                if (error.message.includes("duplicate key value violates unique constraint")) {
                    return await interaction.reply({
                        content: `Failed to whitelist user: User is already whitelisted`,
                        ephemeral: true
                    });
                }
                return await interaction.reply({
                    content: `Failed to whitelist user: ${error.message}`,
                    ephemeral: true
                });
            }

            discordClient.userStatus.set(id, "whitelisted");
        }

        if (minecraftUsername) {
            const uuid = await usernameToUUID(minecraftUsername);
            if (!uuid) {
                return await interaction.reply({
                    content: `Failed to whitelist user: Minecraft user ${minecraftUsername} not found`,
                    ephemeral: true
                });
            }

            const status = await getMinecraftUserStatus(minecraftBot, discordClient, minecraftUsername);
            if (status === "blacklisted") {
                return await interaction.reply({
                    content: `Failed to whitelist user: User is blacklisted`,
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("minecraft_users_whitelist")
                .insert([
                    {minecraft_uuid: uuid},
                ]);
            if (error) {
                if (error.message.includes("duplicate key value violates unique constraint")) {
                    return await interaction.reply({
                        content: `Failed to whitelist user: User is already whitelisted`,
                        ephemeral: true
                    });
                }
                return await interaction.reply({
                    content: `Failed to whitelist user: ${error.message}`,
                    ephemeral: true
                });
            }

            minecraftBot.userStatus.set(uuid, "whitelisted");
        }

        await interaction.reply({
            content: "User whitelisted!",
            ephemeral: true
        });
    }
};
