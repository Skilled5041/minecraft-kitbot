import { Bot } from "mineflayer";
import { Client, WebhookClient } from "discord.js";

export default (bot: Bot, discordBot: Client, webhookClient: WebhookClient, username: string, message: string) => {
    if (!bot.prefix) return;
    if (username.toLowerCase() === bot.username.toLowerCase()) return;
    if (!message.startsWith(bot.prefix ?? "")) return;

    const args = message.slice(bot.prefix.length).trim().split(/ +/g);
    const command = args.shift()?.toLowerCase();

    const cmd = bot.chatCommands?.get(command ?? "") ??
        bot.chatCommands?.get(bot.commandAliases?.get(command ?? "") ?? "");

    if (!cmd) return;
    if (cmd.adminOnly && !bot.admins
        ?.map(username => username.toLowerCase())
        ?.includes(username.toLowerCase())) {
        bot.chat(`You don't have permission to use this command, ${username}.`);
        return;
    }

    cmd.execute(bot, username, args, discordBot, webhookClient);
};
