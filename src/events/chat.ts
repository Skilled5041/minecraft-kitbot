import { Bot } from "mineflayer";
import { Client, WebhookClient } from "discord.js";
import { MineflayerEvent } from "./mineflayer_events.js";
import { getMinecraftUserStatus } from "../utils/user_status.js";

export default <MineflayerEvent>{
    name: "chat",
    async handler(minecraftBot: Bot, discordClient: Client, webhookClient: WebhookClient, username: string, message: string) {

        if (!minecraftBot.prefix) return;
        if (username.toLowerCase() === minecraftBot.username.toLowerCase()) return;
        if (!message.startsWith(minecraftBot.prefix ?? "")) return;

        if (await getMinecraftUserStatus(minecraftBot, discordClient, username) === "blacklisted") {
            return;
        }

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

        if (cmd.whitelistedOnly && await getMinecraftUserStatus(minecraftBot, discordClient, username) !== "whitelisted") {
            return minecraftBot.safeChat(`/w ${username} this command is whitelist only.`);
        }

        if (!minecraftBot.commandCooldowns.get(username)) {
            minecraftBot.commandCooldowns.set(username, new Map());
        }

        if (Date.now() - (minecraftBot.commandCooldowns.get(username)?.get(cmd.name) ?? 0) < 0) {
            return minecraftBot.safeChat(`/w ${username} Please wait a bit before using this command again.`);
        }

        minecraftBot.commandCooldowns.get(username)?.set(cmd.name, Date.now() + (cmd.cooldown ?? 0));
        cmd.execute(minecraftBot, username, args, discordClient, webhookClient);
    }

};
