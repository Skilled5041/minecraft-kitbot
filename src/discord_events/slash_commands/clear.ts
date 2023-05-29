import { SlashCommand } from "./slash_command.js";
import { PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";

export default <SlashCommand>{
    whitelistOnly: false,
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Deletes a specified number of messages from chat.")
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("The number of messages to delete.")
            .setMaxValue(10000)
            .setMinValue(1)
            .setRequired(true)),

    async execute(minecraftBot, discordClient, webhookClient, interaction) {
        const amount = interaction.options.getInteger("amount")!;
        await interaction.reply({content: `Deleting ${amount} messages...`, ephemeral: true});
        (interaction.channel as TextChannel).bulkDelete(amount).then(async () => {
            await interaction.editReply({content: `Deleted ${amount} messages!`});
        });
    }
};
