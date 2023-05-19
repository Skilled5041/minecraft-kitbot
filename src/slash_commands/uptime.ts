import { SlashCommand } from "./slash_command.js";
import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { rgbToHex } from "../utils/colour.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Gets the uptime of the bot."),

    execute(bot, client, interaction) {
        const uptime = client.uptime ?? 0;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;

        let colour: ColorResolvable;
        if (minutes < 20) {
            colour = rgbToHex(255, Math.floor(255 / 20 * minutes), 0);
        } else if (minutes < 40) {
            colour = rgbToHex(Math.floor(255 / 20 * (40 - minutes)), 255, 0);
        } else {
            colour = rgbToHex(0, Math.floor(255 / 20 * (60 - minutes)), 255);
        }


        void interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`The bot has been online for ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`)
                    .setColor(colour)
            ]
        });
    }
};