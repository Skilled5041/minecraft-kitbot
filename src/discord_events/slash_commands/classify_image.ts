import { SlashCommand } from "$src/discord_events/slash_commands/slash_command.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import isImage from "is-image";
import { round } from "$src/utils/numbers.js";

export default <SlashCommand>{
    data: new SlashCommandBuilder()
        .setName("classify-image")
        .setDescription("Classifies an image out of 21,843 classes.")
        .addAttachmentOption(option => option
            .setName("image")
            .setDescription("The image to classify.")
            .setRequired(true)
        ),

    async execute(minecraftBot, discordClient, webhookClient, interaction) {

        await interaction.deferReply();

        const attachment = interaction.options.getAttachment("image");
        if (!attachment) {
            return await interaction.reply({content: "You must provide an image.", ephemeral: true});

        }
        if (!isImage(attachment.url)) {
            return await interaction.reply({content: "The provided file is not an image.", ephemeral: true});

        }
        const image = await fetch(attachment.url);

        const arrayBuffer = await image.arrayBuffer();

        const response = await fetch(
            "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
            {
                headers: {Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`},
                method: "POST",
                body: arrayBuffer,
            }
        );
        if (!response.ok) {
            return await interaction.reply({
                content: "Something went wrong while classifying the image.",
                ephemeral: true
            });

        }

        const data = await response.json();
        if (data.error) {
            return await interaction.reply({
                content: "Something went wrong while classifying the image.",
                ephemeral: true
            });

        }

        let reply = "";
        for (const prediction of data) {
            reply += `**${prediction.label}** : ${round(prediction.score, 4)}\n`;

        }
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Image Classification")
                    .setDescription(reply)
                    .setColor("Purple")
                    .setImage(attachment.url)
            ]
        });

    }
};
