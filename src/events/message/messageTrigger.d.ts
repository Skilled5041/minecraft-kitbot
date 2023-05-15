import { Bot } from "../../customTypes.js";

export interface ChatTrigger {
    name: string;
    description: string;
    trigger: (bot: Bot, message: string) => boolean;
    run: (bot: Bot, message: string) => void;
}
