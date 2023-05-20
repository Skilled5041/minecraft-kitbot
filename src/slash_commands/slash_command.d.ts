import { Bot } from "mineflayer";
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

export interface SlashCommand {
    aliases?: string[];
    hideFromHelp?: boolean;
    adminOnly?: boolean;
    data: SlashCommandBuilder;

    execute: (minecraftBot: Bot, discordClient: Client, interaction: ChatInputCommandInteraction) => Promise<void>;
}
