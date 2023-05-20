import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";
import supabase from "../utils/supabase.js";
import { getDiscordUserStatus, getMinecraftUserStatus } from "../utils/user_status.js";
import { usernameToUUID } from "../utils/minecraft_players.js";

export default <SlashCommand>{
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName("unwhitelist")
        .setDescription("Unwhitelist a user from using the bot")
        .addStringOption(option => option
            .setName("minecraft_username")
            .setRequired(false)
            .setDescription("The Minecraft username of the user to unwhitelist")
            .setMaxLength(16)
            .setMinLength(2))
        .addUserOption(option => option
            .setName("discord_user")
            .setRequired(false)
            .setDescription("The Discord user to unwhitelist")),

    async execute(minecraftBot, discordClient, interaction) {
        const discordUser = interaction.options.getUser("discord_user");
        const minecraftUsername = interaction.options.getString("minecraft_username");

        if (!discordUser && !minecraftUsername) {
            return void await interaction.reply({
                content: "Please specify a user to unwhitelist!",
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
            if (await getDiscordUserStatus(minecraftBot, discordClient, id) !== "whitelisted") {
                return void await interaction.reply({
                    content: "This user is not whitelisted!",
                    ephemeral: true
                });
            }
            const {error} = await supabase
                .from("discord_users_whitelist")
                .delete()
                .match({discord_id: id});
            if (error) {
                return await interaction.reply({
                    content: `Failed to unwhitelist user: ${error.message}`,
                    ephemeral: true
                });
            }

            discordClient.userStatus.set(id, "normal");
        }

        if (minecraftUsername) {
            const uuid = await usernameToUUID(minecraftUsername);
            if (!uuid) {
                return void await interaction.reply({
                    content: "Invalid Minecraft username!",
                    ephemeral: true
                });
            }

            if (await getMinecraftUserStatus(minecraftBot, discordClient, minecraftUsername) !== "whitelisted") {
                return void await interaction.reply({
                    content: "This user is not whitelisted!",
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("minecraft_users_whitelist")
                .delete()
                .match({minecraft_uuid: uuid});
            if (error) {
                return await interaction.reply({
                    content: `Failed to unwhitelist user: ${error.message}`,
                    ephemeral: true
                });
            }

            minecraftBot.userStatus.set(uuid, "normal");
        }

        await interaction.reply({
            content: "Successfully unwhitelisted user!",
            ephemeral: true
        });
    }
};
