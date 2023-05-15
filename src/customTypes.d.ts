import { Bot as mineFlayerBot} from "mineflayer";
import { ChatTrigger } from "./events/message/messageTrigger.js";
import { ChatCommand } from "./events/chat/chatCommand.js";

export interface Bot extends mineFlayerBot {
    prefix?: string;
    admins?: string[];
    chatCommands?: Map<string, ChatCommand>;
    commandAliases?: Map<string, string>;
    messageTriggers?: Map<string, ChatTrigger>;
    startTime?: number;
    getTps?: () => number;
}

export interface Options {
    host: string;
    username: string;
    auth: "microsoft" | "mojang";
    version: string;
}
