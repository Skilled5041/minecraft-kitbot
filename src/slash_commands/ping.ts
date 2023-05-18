import { SlashCommand } from "./slash_command.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns the ping of the bot."),

    async execute(bot, client, interaction: ChatInputCommandInteraction) {
        await interaction.reply(`Websocket heartbeat: ${client.ws.ping} ms.\nLatency: ${Date.now() - interaction.createdTimestamp} ms.`);
    }

};
