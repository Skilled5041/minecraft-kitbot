import { Bot } from "mineflayer";
import { Client, WebhookClient } from "discord.js";
import { MineflayerEvent } from "./mineflayer_events.js";

export default <MineflayerEvent>{
    name: "chat",
    async handler(minecraftBot: Bot, discordClient: Client, webhookClient: WebhookClient, username: string, message: string) {
        if (!minecraftBot.prefix) return;
        if (username.toLowerCase() === minecraftBot.username.toLowerCase()) return;
        if (!message.startsWith(minecraftBot.prefix ?? "")) return;

        if (Date.now() - (minecraftBot.messageInfo.lastPlayerCommandTime.get(username) ?? 0) < 1000) {
            return void minecraftBot.safeChat(`/w ${username} Please wait a bit before sending another command.`);
        }
        minecraftBot.messageInfo.lastPlayerCommandTime.set(username, Date.now());

        const args = message.slice(minecraftBot.prefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();

        const cmd = minecraftBot.chatCommands?.get(command ?? "") ??
            minecraftBot.chatCommands?.get(minecraftBot.commandAliases?.get(command ?? "") ?? "");

        if (!cmd) return;
        if (cmd.adminOnly && !minecraftBot.admins
            ?.map(username => username.toLowerCase())
            ?.includes(username.toLowerCase())) {

            return minecraftBot.safeChat(`You don't have permission to use this command, ${username}.`);
        }

        cmd.execute(minecraftBot, username, args, discordClient, webhookClient);
    }

};
