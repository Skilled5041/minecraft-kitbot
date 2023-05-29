import { DiscordEvent } from "$src/discord_events/discord_event.js";
import { EmbedBuilder, Events, Message, WebhookClient } from "discord.js";
import fs from "fs";
import chalk from "chalk";
import { DiscordChatCommand } from "$src/discord_events/chat_commands/discord_chat_command.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";
import * as process from "process";

export default <DiscordEvent>{
    event: Events.MessageCreate,
    async register(minecraftBot, discordClient, webhookClient) {
        const chatCommandFiles = fs.readdirSync("./src/discord_events/chat_commands").filter(file => file.endsWith(".js"));

        for (const file of chatCommandFiles) {
            const command: DiscordChatCommand = (await import(`./chat_commands/${file}`)).default;
            const commandName = command.name.toString();
            const aliases = command.aliases ?? [];

            for (const alias of aliases) {
                discordClient.commandAliases?.set(alias.toLowerCase(), commandName);
            }

            discordClient.chatCommands?.set(commandName, command);

            console.log(chalk.blueBright(`Registered discord chat command "${commandName}"`));
        }

        const messageTriggerFiles = fs.readdirSync("./src/discord_events/chat_messages").filter(file => file.endsWith(".js"));

        for (const file of messageTriggerFiles) {
            const trigger = (await import(`./chat_messages/${file}`)).default;
            const triggerName = trigger.name;

            discordClient.messageTriggers?.set(triggerName, trigger);
            console.log(chalk.blueBright(`Registered discord message trigger "${triggerName}"`));
        }
    },

    async handler(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, message: Message) {

        if (message.author.bot || message.webhookId) return;
        for (const trigger of discordClient.messageTriggers?.values() ?? []) {

            if (trigger.trigger(minecraftBot, discordClient, webhookClient, message)) {
                await trigger.execute(minecraftBot, discordClient, webhookClient, message);
            }
        }

        if (!discordClient.prefixes) {
            console.log(chalk.redBright("No prefixes found!"));
            process.exit(1);
        }

        if (!discordClient.prefixes.some(prefix => message.content.startsWith(prefix))) return;

        if (await discordClient.getDiscordUserStatus(message.author.id) === "blacklisted") {
            return;
        }

        const prefix = discordClient.prefixes.find(prefix => message.content.startsWith(prefix)) ?? "";
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift()?.toLowerCase();

        const cmd = discordClient.chatCommands?.get(command ?? "") ??
            discordClient.chatCommands?.get(discordClient.commandAliases?.get(command ?? "") ?? "");

        if (!cmd) return;

        if (cmd.adminOnly && !discordClient.admins
            ?.map((username: string) => username.toLowerCase())
            ?.includes(message.author.id)) {

            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("You don't have permission to use this command.")
                        .setColor("Red")
                ]
            });
        }

        if (cmd.whitelistedOnly && await discordClient.getDiscordUserStatus(message.author.id) !== "whitelisted") {
            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("You don't have permission to use this command.")
                        .setColor("Red")
                ]
            });
        }

        if (!discordClient.lastUserMessageTime.has(message.author.id)) {
            discordClient.lastUserMessageTime.set(message.author.id, 0);
        }

        if (Date.now() - (discordClient.lastUserMessageTime.get(message.author.id) ?? 0) < 1000) {
            return await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Please wait a bit before sending another bridge message.")
                        .setColor("Red")
                ]
            });
        }
        discordClient.lastUserMessageTime.set(message.author.id, Date.now());
        cmd.execute(minecraftBot, discordClient, webhookClient, message, args);
    }
};
