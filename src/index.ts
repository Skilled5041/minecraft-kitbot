import mineflayer, { Bot, BotEvents, createBot, BotOptions } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import * as movement from "mineflayer-movement";
import * as fs from "fs";
import chalk from "chalk";
import { ChatCommand } from "./events/chat/cat_command.js";
import { ChatTrigger } from "./events/message/message_trigger.js";
import createTpsPlugin from "mineflayer-tps";
import { Client, Collection, Events, IntentsBitField, WebhookClient } from "discord.js";
import { SlashCommand } from "./slash_commands/slash_command.js";
import dotenv from "dotenv";


declare module "discord.js" {
    interface Client {
        slashCommands: Collection<string, SlashCommand>;
    }
}

declare module "mineflayer" {
    interface Bot {
        prefix: string;
        admins?: string[];
        chatCommands?: Map<string, ChatCommand>;
        commandAliases?: Map<string, string>;
        messageTriggers?: Map<string, ChatTrigger>;
        startTime?: number;
        getTps?: () => number;
    }
}

dotenv.config();

const intents = new IntentsBitField([IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages]);
const discordClient = new Client({intents});
const webhookClient = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL ?? "",
    token: process.env.DISCORD_BOT_TOKEN ?? ""
});

discordClient.once(Events.ClientReady, (c) => {
    console.log(chalk.cyan(`Logged in as ${c.user.tag}`));
    discordClient.user?.setPresence({
        status: "online",
        activities: [{
            name: "0b0t.org",
            url: "https://0b0t.org",
        }]
    });
});

discordClient.slashCommands = new Collection();

void discordClient.login(process.env.DISCORD_BOT_TOKEN);


const createModifiedBot = (options: BotOptions, prefix: string, admins: string[]): Bot => {
    const bot: Bot = createBot({
        host: options.host,
        username: "solarion2",
        version: options.version,
        auth: options.auth,
        chatLengthLimit: 256,
    });
    bot.prefix = prefix;
    bot.admins = admins;
    bot.chatCommands = new Map();
    bot.messageTriggers = new Map();
    bot.commandAliases = new Map();
    bot.startTime = Date.now();
    bot.admins = admins;
    return bot;
};

const minecraftBot: Bot = createModifiedBot({
    host: "0b0t.org",
    username: "Solarion2",
    version: "1.12.2",
    auth: "microsoft",
}, "&", ["Solarion2", "zSkilled_"]);

const tpsPlugin = createTpsPlugin(mineflayer);
minecraftBot.loadPlugins([movement.plugin, tpsPlugin]);

minecraftBot.once("login", () => {
    console.log(chalk.blueBright(`Logged in as ${minecraftBot.username}.`));
    console.log("Viewer running on http://localhost:3000");
});

minecraftBot.once("spawn", () => {
    mineflayerViewer(minecraftBot, {firstPerson: false, port: 3000});

    minecraftBot.setControlState("jump", true);
    setTimeout(() => minecraftBot.setControlState("jump", false), 1000);

    const path = [minecraftBot.entity.position.clone()];

    setInterval(() => {
        minecraftBot.setControlState("jump", true);
        setTimeout(() => minecraftBot.setControlState("jump", false), 1000);
    }, 60000);

    minecraftBot.on("move", () => {
        if (path[path.length - 1].distanceTo(minecraftBot.entity.position) > 1) {
            path.push(minecraftBot.entity.position.clone());
        }
    });
});

minecraftBot.on("respawn", () => {
    minecraftBot.setControlState("jump", true);
    setTimeout(() => minecraftBot.setControlState("jump", false), 1000);
});

if (!minecraftBot.prefix) {
    console.log(chalk.yellowBright("Prefix is not set."));
    process.exit(1);
}

if (!minecraftBot.chatCommands) {
    console.log(chalk.yellowBright("Chat commands are not set."));
    process.exit(1);
}

const eventFiles: string[] = fs.readdirSync("./src/events").filter(file => file.includes(".js"));
for (const file of eventFiles) {
    const eventName: string = file.split(".")[0];
    const event = (await import(`./events/${eventName}.js`)).default;

    minecraftBot.on(eventName as keyof BotEvents, event.bind(null, minecraftBot, discordClient, webhookClient));
    console.log(chalk.blueBright(`Registered event "${eventName}"`));
}

const chatCommandFiles: string[] = fs.readdirSync("./src/events/chat").filter(file => file.includes(".js"));

for (const file of chatCommandFiles) {
    const command: ChatCommand = (await import(`./events/chat/${file}`)).default;
    const commandName = command.name;
    const aliases = command.aliases ?? [];

    for (const alias of aliases) {
        minecraftBot.commandAliases?.set(alias, commandName);
    }

    minecraftBot.chatCommands?.set(commandName, command);
    console.log(chalk.greenBright(`Registered command "${commandName}"`));
}

const messageTriggerFiles: string[] = fs.readdirSync("./src/events/message").filter(file => file.includes(".js"));

for (const file of messageTriggerFiles) {
    const trigger: ChatTrigger = (await import(`./events/message/${file}`)).default;
    const triggerName = trigger.name;

    minecraftBot.messageTriggers?.set(triggerName, trigger);
    console.log(chalk.greenBright(`Registered message trigger "${triggerName}"`));
}

minecraftBot.on("kicked", (reason, loggedIn) => console.log(reason.toString(), loggedIn));
minecraftBot.on("error", (err) => console.log(err));

const slashCommandFiles = fs.readdirSync("./src/slash_commands").filter(file => file.includes(".js"));
for (const file of slashCommandFiles) {
    const command: SlashCommand = (await import(`./slash_commands/${file}`)).default;
    discordClient.slashCommands.set(command.data.name, command);
    console.log(chalk.greenBright(`Registered slash command "${command.data.name}"`));
}
discordClient.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = discordClient.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(minecraftBot, discordClient, interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({content: "There was an error while executing this command!", ephemeral: true});
        } else {
            await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
        }
    }
});
