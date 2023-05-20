import { usernameToUUID } from "./minecraft_players.js";
import { UserStatus } from "../index.js";
import supabase from "./supabase.js";
import { logErrors } from "./log_errors.js";
import { Bot } from "mineflayer";
import { Client } from "discord.js";

export const getMinecraftUserStatus = async (minecraftBot: Bot, discordClient: Client, username: string): Promise<UserStatus | null> => {
    const uuid = await usernameToUUID(username);
    if (!uuid) {
        return null;
    }

    if (minecraftBot.userStatus.has(uuid)) {
        const status = minecraftBot.userStatus.get(uuid);
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
        minecraftBot.userStatus.set(uuid, "blacklisted");
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
        minecraftBot.userStatus.set(uuid, "whitelisted");
        return "whitelisted";
    }

    minecraftBot.userStatus.set(uuid, "normal");
    return "normal";
};

export const getDiscordUserStatus = async (minecraftBot: Bot, discordClient: Client, id: string): Promise<UserStatus> => {
    if (discordClient.userStatus.has(id)) {
        const status = discordClient.userStatus.get(id);
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
        discordClient.userStatus.set(id, "blacklisted");
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
        discordClient.userStatus.set(id, "whitelisted");
        return "whitelisted";
    }

    discordClient.userStatus.set(id, "normal");
    return "normal";
};
