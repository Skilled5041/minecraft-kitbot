import { ChatCommand } from "./chat_command.js";

export default <ChatCommand>{
    name: "help",
    description: "Shows a list of commands.",
    usage: "<prefix>help [command_name | page_number]",
    execute: async (minecraftBot, username, args) => {
        if (args.length === 0 || !isNaN(Number(args[0]))) {

            const page = Number(args[0]) || 1;
            let str = "Commands: ";
            for (const command of minecraftBot.chatCommands?.values() ?? []) {
                if (command.hideFromHelp) continue;
                str += `${command.name}, `;
            }
            str = str.slice(0, -2);

            const numPages = Math.ceil(str.length / 220);

            if (page > numPages) {
                return minecraftBot.safeChat(`/w ${username} There are only ${numPages} pages.`);
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
            return minecraftBot.safeChat(`/w ${username} ${pages[page - 1].slice(0, -1)}. Page ${page} of ${numPages}`);
        }

        const command = minecraftBot.chatCommands?.get(args[0]) ?? minecraftBot.chatCommands?.get(minecraftBot.commandAliases?.get(args[0]) ?? "");

        if (!command || command.hideFromHelp) {
            return minecraftBot.safeChat(`/w ${username} Command not found.`);
        }
        let str = `Name: ${command?.name}. Description: ${command?.description} Usage: ${command?.usage}. Aliases: ${command?.aliases?.join(", ") ?? "None"}`;

        return void minecraftBot.safeChat(`/w ${username} ${str}`);
    }
};
