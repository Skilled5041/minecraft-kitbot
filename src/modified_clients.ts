import { Bot, BotOptions, createBot } from "mineflayer";
import { ChatCommand } from "./events/chat/chat_command.js";
import { ChatTrigger } from "./events/message/message_trigger.js";
import { UserStatus } from "./index.js";
import { usernameToUUID } from "./utils/minecraft_players.js";
import supabase from "./utils/supabase.js";
import { logErrors } from "./utils/log_errors.js";
import { Client, ClientOptions, Collection } from "discord.js";
import { SlashCommand } from "./slash_commands/slash_command.js";

export type Success = boolean;

export interface ExtendedMinecraftBot extends Bot {
    prefixes: string[];
    admins: string[];
    chatCommands: Map<string, ChatCommand>;
    commandAliases: Map<string, string>;
    messageTriggers: Map<string, ChatTrigger>;
    startTime: number;
    getTps: () => number;
    userStatus: Map<string, UserStatus>;
    messageInfo: {
        /**
         * The UNIX time the next must be sent after
         */
        minimumNextMessageTime: number | null;
        /**
         * The UNIX time the last message was sent by a player
         */
        lastPlayerCommandTime: Map<string, number>
    };
    commandCooldowns: Map<string, Map<string, number>>;
    /**
     * A wrapper for chat that prevents spam.
     * @param message The message to send
     */
    safeChat: (message: string) => Success;
    getMinecraftUserStatus: (username: string) => Promise<UserStatus | null>;
}

export interface ExtraMinecraftBotOptions {
    prefixes: string[];
    admins: string[];
}

export const createExtendedMinecraftBot = (options: BotOptions, extendedOptions: ExtraMinecraftBotOptions): ExtendedMinecraftBot => {
    const bot = createBot(options) as ExtendedMinecraftBot;
    bot.prefixes = extendedOptions.prefixes;
    bot.admins = extendedOptions.admins;
    bot.chatCommands = new Map();
    bot.commandAliases = new Map();
    bot.messageTriggers = new Map();
    bot.startTime = Date.now();
    bot.messageInfo = {
        minimumNextMessageTime: null,
        lastPlayerCommandTime: new Map()
    };
    bot.commandCooldowns = new Map();
    bot.userStatus = new Map();
    bot.safeChat = (message: string): Success => {
        if (Date.now() < (bot.messageInfo.minimumNextMessageTime ?? 0) && !message.startsWith("/")) {
            return false;
        }

        if (message.length > 255) {
            return false;
        }

        bot.messageInfo.minimumNextMessageTime = Date.now() + 1000;
        bot.chat(message);
        return true;
    };
    bot.getMinecraftUserStatus = async (username: string): Promise<UserStatus | null> => {
        const uuid = await usernameToUUID(username);
        if (!uuid) {
            return null;
        }

        if (bot.userStatus.has(uuid)) {
            const status = bot.userStatus.get(uuid);
            if (status) {
                return status;
            }
        }

        const {data: minecraftBlacklistData, error: error1} = await supabase
            .from("minecraft_users_blacklist")
            .select("*")
            .match({minecraft_uuid: uuid});

        if (error1) {
            logErrors(error1.message);
        }

        const isMinecraftBlacklisted = (minecraftBlacklistData?.length ?? []) > 0;
        if (isMinecraftBlacklisted) {
            bot.userStatus.set(uuid, "blacklisted");
            return "blacklisted";
        }

        const {data: minecraftWhitelistData, error: error2} = await supabase
            .from("minecraft_users_whitelist")
            .select("*")
            .match({minecraft_uuid: uuid});

        if (error2) {
            logErrors(error2.message);
        }

        const isMinecraftWhitelisted = (minecraftWhitelistData?.length ?? []) > 0;
        if (isMinecraftWhitelisted) {
            bot.userStatus.set(uuid, "whitelisted");
            return "whitelisted";
        }

        bot.userStatus.set(uuid, "normal");
        return "normal";
    };

    return bot;
};

export interface ExtendedDiscordClient extends Client {
    slashCommands: Collection<string, SlashCommand>;
    lastUserMessageTime: Map<string, number>;
    userStatus: Map<string, UserStatus>;
    getDiscordUserStatus: (id: string) => Promise<UserStatus | null>;
}

export const createExtendedDiscordClient = (options: ClientOptions) => {
    const client = new Client(options) as ExtendedDiscordClient;
    client.slashCommands = new Collection();
    client.lastUserMessageTime = new Map();
    client.userStatus = new Map();
    client.getDiscordUserStatus = async (id: string): Promise<UserStatus | null> => {
        if (client.userStatus.has(id)) {
            const status = client.userStatus.get(id);
            if (status) {
                return status;
            }
        }

        const {data: discordBlacklistData, error} = await supabase
            .from("discord_users_blacklist")
            .select("*")
            .match({discord_id: id});

        if (error) {
            logErrors(error.message);
        }

        const isDiscordBlacklisted = (discordBlacklistData?.length ?? []) > 0;
        if (isDiscordBlacklisted) {
            client.userStatus.set(id, "blacklisted");
            return "blacklisted";
        }

        const {data: discordWhitelistData, error: error2} = await supabase
            .from("discord_users_whitelist")
            .select("*")
            .match({discord_id: id});

        if (error2) {
            logErrors(error2.message);
        }

        const isDiscordWhitelisted = (discordWhitelistData?.length ?? []) > 0;
        if (isDiscordWhitelisted) {
            client.userStatus.set(id, "whitelisted");
            return "whitelisted";
        }

        client.userStatus.set(id, "normal");
        return "normal";
    };
    return client;
};
