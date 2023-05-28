import { DiscordEvent } from "./discord_event.js";
import { Events, Interaction, WebhookClient } from "discord.js";
import fs from "fs";
import { SlashCommand } from "$src/discord_events/slash_commands/slash_command.js";
import chalk from "chalk";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";

export default <DiscordEvent>{
    event: Events.InteractionCreate,

    async register(minecraftBot, discordClient, webhookClient) {
        const slashCommandFiles = fs.readdirSync("./src/discord_events/slash_commands").filter(file => file.endsWith(".js"));
        for (const file of slashCommandFiles) {
            const command: SlashCommand = (await import(`./slash_commands/${file}`)).default;
            discordClient.slashCommands.set(command.data.name, command);
            console.log(chalk.greenBright(`Registered slash command "${command.data.name}"`));
        }
    },
    async handler(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (await discordClient.getDiscordUserStatus(interaction.user.id) === "blacklisted" && interaction.user.id !== "313816298461069313") {
            return;
        }

        const command = discordClient.slashCommands.get(interaction.commandName);

        if (!command) return;

        if (command.ownerOnly && interaction.user.id !== "313816298461069313") {
            return void await interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            });
        }

        if (command.whitelistOnly && discordClient.userStatus.get(interaction.user.id) !== "whitelisted") {
            return void await interaction.reply({
                content: "You do not have permission to use this command!",
                ephemeral: true
            });
        }

        if (Date.now() - (discordClient.lastUserMessageTime.get(interaction.user.id) ?? 0) < 2000) {
            return void await interaction.reply({
                content: "Please wait a while before using another command!",
                ephemeral: true
            });
        }

        discordClient.lastUserMessageTime.set(interaction.user.id, Date.now());

        try {
            await command.execute(minecraftBot, discordClient, interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
            } else {
                await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
            }
        }
    }
};
