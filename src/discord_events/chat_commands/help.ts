import { DiscordChatCommand } from "$src/discord_events/chat_commands/discord_chat_command.js";
import { EmbedBuilder } from "discord.js";

export default <DiscordChatCommand>{
    name: "help",
    description: "Replies with a list of commands, or information about a specific command.",
    usage: "<prefix>help [command]",
    cooldown: 1000,
    async execute(minecraftBot, discordClient, webhookClient, message, args) {
        if (args.length === 0) {
            let str = "Available commands: ";
            for (const command of discordClient.chatCommands.values()) {
                str += `${command.name}, `;
            }

            str = str.slice(0, -2);
            str += ".";

            const embed = new EmbedBuilder()
                .setTitle("Help")
                .setDescription(str)
                .setColor("Blue");

            await message.reply({embeds: [embed], allowedMentions: {repliedUser: false}});
        } else {
            const commandName = args[0].toLowerCase();
            const command = discordClient.chatCommands.get(commandName);

            if (!command) {
                return await message.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Command not found.")
                        .setColor("Red")],
                    allowedMentions: {repliedUser: false}
                });
            }

            let str = `**Name:** ${command.name}\n **Description:** ${command.description}\n **Usage:** ${command.usage}\n`;

            const embed = new EmbedBuilder()
                .setTitle(`Help: ${command.name}`)
                .setDescription(str)
                .setColor("Blue");

            await message.reply({embeds: [embed], allowedMentions: {repliedUser: false}});
        }
    }
};
