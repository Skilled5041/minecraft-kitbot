import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import { SlashCommand } from "./slash_commands/slash_command.js";

dotenv.config();

const commands = [];

const commandFolder = fs.readdirSync("./src/slash_commands").filter(file => file.endsWith(".js"));
for (const file of commandFolder) {
    const command: SlashCommand = (await import(`./slash_commands/${file}`)).default
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN ?? "");

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data: any = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID ?? ""),
            {body: commands},
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
