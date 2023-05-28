import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";
import supabase from "../../utils/supabase.js";
import { usernameToUUID } from "../../utils/minecraft_players.js";

export default <SlashCommand>{
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Blacklist a user from using the bot")
        .addStringOption(option => option
            .setName("minecraft_username")
            .setRequired(false)
            .setDescription("The Minecraft username of the user to blacklist")
            .setMaxLength(16)
            .setMinLength(2))
        .addUserOption(option => option
            .setName("discord_user")
            .setRequired(false)
            .setDescription("The Discord user to blacklist")),

    async execute(minecraftBot, discordClient, interaction) {
        const discordUser = interaction.options.getUser("discord_user");
        const minecraftUsername = interaction.options.getString("minecraft_username");

        if (!discordUser && !minecraftUsername) {
            return void await interaction.reply({
                content: "Please specify a user to blacklist!",
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

            const {error: whitelistError} = await supabase
                .from("discord_users_whitelist")
                .delete()
                .eq("discord_id", id);
            if (whitelistError) {
                return await interaction.reply({
                    content: `Failed to blacklist user: ${whitelistError.message}`,
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("discord_users_blacklist")
                .insert([
                    {discord_id: id},
                ]);
            if (error) {
                if (error.message.includes("duplicate key value violates unique constraint")) {
                    return await interaction.reply({
                        content: "User is already blacklisted!",
                        ephemeral: true
                    });
                }
                return await interaction.reply({
                    content: `Failed to blacklist user: ${error.message}`,
                    ephemeral: true
                });
            }

            discordClient.userStatus.set(id, "blacklisted");
        }

        if (minecraftUsername) {
            const uuid = await usernameToUUID(minecraftUsername);
            if (!uuid) {
                return await interaction.reply({
                    content: "Invalid Minecraft username!",
                    ephemeral: true
                });
            }

            const {error: whitelistError} = await supabase
                .from("minecraft_users_whitelist")
                .delete()
                .eq("minecraft_uuid", uuid);
            if (whitelistError) {
                return await interaction.reply({
                    content: `Failed to blacklist user: ${whitelistError.message}`,
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("minecraft_users_blacklist")
                .insert([
                    {minecraft_uuid: uuid},
                ]);
            if (error) {
                if (error.message.includes("duplicate key value violates unique constraint")) {
                    return await interaction.reply({
                        content: "User is already blacklisted!",
                        ephemeral: true
                    });
                }
                return await interaction.reply({
                    content: `Failed to blacklist user: ${error.message}`,
                    ephemeral: true
                });
            }

            minecraftBot.userStatus.set(uuid, "blacklisted");
        }

        await interaction.reply({
            content: "Successfully blacklisted user!",
            ephemeral: true
        });
    }
};

