import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "../../modified_clients.js";

export interface SlashCommand {
    aliases?: string[];
    hideFromHelp?: boolean;
    ownerOnly?: boolean;
    whitelistOnly?: boolean;
    data: SlashCommandBuilder;

    execute: (minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, interaction: ChatInputCommandInteraction) => Promise<void>;
}
