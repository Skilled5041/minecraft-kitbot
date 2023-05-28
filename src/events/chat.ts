import { WebhookClient } from "discord.js";
import { MineflayerEvent } from "./mineflayer_events.js";
import { ExtendedDiscordClient, ExtendedMinecraftBot } from "$src/modified_clients.js";
import fs from "fs";
import { ChatCommand } from "./chat/chat_command.js";
import chalk from "chalk";

export default <MineflayerEvent>{
    name: "chat",

    async register(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient) {
        const chatCommandFiles: string[] = fs.readdirSync("./src/events/chat").filter(file => file.endsWith(".js"));

        for (const file of chatCommandFiles) {
            const command: ChatCommand = (await import(`./chat/${file}`)).default;
            const commandName = command.name;
            const aliases = command.aliases ?? [];

            for (const alias of aliases) {
                minecraftBot.commandAliases?.set(alias, commandName);
            }

            minecraftBot.chatCommands?.set(commandName, command);
            console.log(chalk.greenBright(`Registered command "${commandName}"`));
        }
    },

    async handler(minecraftBot: ExtendedMinecraftBot, discordClient: ExtendedDiscordClient, webhookClient: WebhookClient, username: string, message: string) {

        if (!minecraftBot.prefixes) return;
        if (username.toLowerCase() === minecraftBot.username.toLowerCase()) return;
        if (!minecraftBot.prefixes.some(prefix => message.startsWith(prefix))) return;

        if (await minecraftBot.getMinecraftUserStatus(username) === "blacklisted") {
            return;
        }

        if (Date.now() - (minecraftBot.messageInfo.lastPlayerCommandTime.get(username) ?? 0) < 1000) {
            return void minecraftBot.safeChat(`/w ${username} Please wait a bit before sending another command.`);
        }
        minecraftBot.messageInfo.lastPlayerCommandTime.set(username, Date.now());

        const prefix = minecraftBot.prefixes.find(prefix => message.startsWith(prefix)) ?? "";

        const args = message.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();

        const cmd = minecraftBot.chatCommands?.get(command ?? "") ??
            minecraftBot.chatCommands?.get(minecraftBot.commandAliases?.get(command ?? "") ?? "");

        if (!cmd) return;
        if (cmd.adminOnly && !minecraftBot.admins
            ?.map(username => username.toLowerCase())
            ?.includes(username.toLowerCase())) {

            return minecraftBot.safeChat(`You don't have permission to use this command, ${username}.`);
        }

        if (cmd.whitelistedOnly && await minecraftBot.getMinecraftUserStatus(username) !== "whitelisted") {
            return minecraftBot.safeChat(`/w ${username} this command is whitelist only.`);
        }

        if (!minecraftBot.commandCooldowns.get(username)) {
            minecraftBot.commandCooldowns.set(username, new Map());
        }

        if (Date.now() - (minecraftBot.commandCooldowns.get(username)?.get(cmd.name) ?? 0) < 0) {
            return minecraftBot.safeChat(`/w ${username} Please wait a bit before using this command again.`);
        }

        minecraftBot.commandCooldowns.get(username)?.set(cmd.name, Date.now() + (cmd.cooldown ?? 0));
        cmd.execute(minecraftBot, discordClient, webhookClient, username, args);
    }
};
