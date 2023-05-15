import { Bot } from "../customTypes.js";

export default (bot: Bot, message: any) => {
    console.log(message.toAnsi());
    for (const trigger of bot.messageTriggers?.values() ?? []) {
        if (trigger.trigger(bot, message.toString())) {
            trigger.run(bot, message.toString());
        }
    }
};
