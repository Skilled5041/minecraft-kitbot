import { SlashCommand } from "./slash_command.js";
import { SlashCommandBuilder } from "discord.js";
import supabase from "../utils/supabase.js";
import { usernameToUUID } from "../utils/minecraft_players.js";
import { getDiscordUserStatus, getMinecraftUserStatus } from "../utils/user_status.js";

export default <SlashCommand>{
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName("unblacklist")
        .setDescription("Unblacklist a user from using the bot")
        .addStringOption(option => option
            .setName("minecraft_username")
            .setRequired(false)
            .setDescription("The Minecraft username of the user to unblacklist")
            .setMaxLength(16)
            .setMinLength(2))
        .addUserOption(option => option
            .setName("discord_user")
            .setRequired(false)
            .setDescription("The Discord user to unblacklist")),

    async execute(minecraftBot, discordClient, interaction) {
        const discordUser = interaction.options.getUser("discord_user");
        const minecraftUsername = interaction.options.getString("minecraft_username");

        if (!discordUser && !minecraftUsername) {
            return void await interaction.reply({
                content: "Please specify a user to unblacklist!",
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
            if (await getDiscordUserStatus(minecraftBot, discordClient, id) !== "blacklisted") {
                return void await interaction.reply({
                    content: "This user is not blacklisted!",
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("discord_users_blacklist")
                .delete()
                .match({discord_id: id});
            if (error) {
                return await interaction.reply({
                    content: `Failed to unblacklist user: ${error.message}`,
                    ephemeral: true
                });
            }

            discordClient.userStatus.set(id, "normal");
        }

        if (minecraftUsername) {
            const uuid = await usernameToUUID(minecraftUsername);
            if (!uuid) {
                return await interaction.reply({
                    content: "Invalid Minecraft username!",
                    ephemeral: true
                });
            }

            if (await getMinecraftUserStatus(minecraftBot, discordClient, minecraftUsername) !== "blacklisted") {
                return void await interaction.reply({
                    content: "This user is not blacklisted!",
                    ephemeral: true
                });
            }

            const {error} = await supabase
                .from("minecraft_users_blacklist")
                .delete()
                .match({minecraft_uuid: uuid});
            if (error) {
                return await interaction.reply({
                    content: `Failed to unblacklist user: ${error.message}`,
                    ephemeral: true
                });
            }

            minecraftBot.userStatus.set(uuid, "normal");
        }

        await interaction.reply({
            content: "Successfully unblacklisted user!",
            ephemeral: true
        });
    }
};
