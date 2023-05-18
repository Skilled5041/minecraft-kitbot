import { ChatCommand } from "./cat_command.js";

export default <ChatCommand>{
    name: "help",
    description: "Shows a list of commands.",
    usage: "<prefix>help [command_name | page_number]",
    execute: async (bot, username, args) => {
        if (args.length === 0 || !isNaN(Number(args[0]))) {
            // const commandHelp: string = "Use ${bot.prefix}help [command_name] to get more information about a command." +
            //     " <prefix> is the prefix of the bot. <> are required arguments." +
            //     " [] are optional arguments."

            const page = Number(args[0]) || 1;
            let str = "Commands: ";
            for (const command of bot.chatCommands?.values() ?? []) {
                str += `${command.name}, `;
            }
            str = str.slice(0, -2);

            const numPages = Math.ceil(str.length / 220);

            if (page > numPages) {
                return bot.chat(`/w ${username} There are only ${numPages} pages.`);
            }

            const splitStr = str.split(" ");
            const pages = [];
            let pageStr = "";
            for (const word of splitStr) {
                if (pageStr.length + word.length > 200) {
                    pages.push(pageStr);
                    pageStr = "";
                }
                pageStr += `${word} `;
            }

            pages.push(pageStr);
            return bot.chat(`/w ${username} ${pages[page - 1].slice(0, -1)}. Page ${page} of ${numPages}`);
        }

        const command = bot.chatCommands?.get(args[0]) ?? bot.chatCommands?.get(bot.commandAliases?.get(args[0]) ?? "");

        if (!command || command.hideFromHelp) {
            return bot.chat(`/w ${username} Command not found.`);
        }
        let str = `Name: ${command?.name}. Description: ${command?.description} Usage: ${command?.usage}. Aliases: ${command?.aliases?.join(", ") ?? "None"}`;

        return bot.chat(`/w ${username} ${str}`);
    }
};
