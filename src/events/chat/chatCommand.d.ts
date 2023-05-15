import { Bot } from "../../customTypes.js";

export interface ChatCommand {
    name: string;
    description: string;
    usage: string;
    hideFromHelp?: boolean;
    aliases?: string[];
    adminOnly?: boolean;

    run: (bot: Bot, username: string, args: string[]) => void;
}
