import mineflayer, { BotEvents, createBot } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import * as movement from "mineflayer-movement";
import * as fs from "fs";
import chalk from "chalk";
import { Bot, Options } from "./customTypes.js";
import { ChatCommand } from "./events/chat/chatCommand.js";
import { ChatTrigger } from "./events/message/messageTrigger.js";
import createTpsPlugin from "mineflayer-tps";
import { Client, Events, IntentsBitField, WebhookClient } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const intents = new IntentsBitField([IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages]);
const client = new Client({intents});
const webhookClient = new WebhookClient({
    url: process.env.DISCORD_WEBHOOK_URL ?? "",
    token: process.env.DISCORD_BOT_TOKEN ?? ""
});

client.once(Events.ClientReady, (c) => {
    console.log(chalk.cyan(`Logged in as ${c.user.tag}`));client.user?.setPresence({
        status: "online",
        activities: [{
            name: "0b0t.org",
            url: "https://0b0t.org",
            // @ts-ignore
            type: "PLAYING"
        }]
    });

});

void client.login(process.env.DISCORD_BOT_TOKEN);


const createModifiedBot = (options: Options, prefix: string, admins: string[]): Bot => {
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

const bot: Bot = createModifiedBot({
    host: "0b0t.org",
    username: "Solarion2",
    version: "1.12.2",
    auth: "microsoft",
}, "&", ["Solarion2", "zSkilled_"]);

const tpsPlugin = createTpsPlugin(mineflayer);
bot.loadPlugins([movement.plugin, tpsPlugin]);

bot.once("login", () => {
    console.log(chalk.blueBright(`Logged in as ${bot.username}.`));
    console.log("Viewer running on http://localhost:3000");
});

bot.once("spawn", () => {
    mineflayerViewer(bot, {firstPerson: false, port: 3000});

    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 1000);

    const path = [bot.entity.position.clone()];

    setInterval(() => {
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 1000);
    }, 60000);

    bot.on("move", () => {
        if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
            path.push(bot.entity.position.clone());
        }
    });
});

bot.on("respawn", () => {
    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 1000);
});

if (!bot.prefix) {
    console.log(chalk.yellowBright("Prefix is not set."));
    process.exit(1);
}

if (!bot.chatCommands) {
    console.log(chalk.yellowBright("Chat commands are not set."));
    process.exit(1);
}

const eventFiles: string[] = fs.readdirSync("./src/events").filter(file => file.includes(".js"));
for (const file of eventFiles) {
    const eventName: string = file.split(".")[0];
    const event = (await import(`./events/${eventName}.js`)).default;

    bot.on(eventName as keyof BotEvents, event.bind(null, bot, client, webhookClient));
    console.log(chalk.blueBright(`Registered event "${eventName}"`));
}

const chatCommandFiles: string[] = fs.readdirSync("./src/events/chat").filter(file => file.includes(".js"));

for (const file of chatCommandFiles) {
    const command: ChatCommand = (await import(`./events/chat/${file}`)).default;
    const commandName = command.name;
    const aliases = command.aliases ?? [];

    for (const alias of aliases) {
        bot.commandAliases?.set(alias, commandName);
    }

    bot.chatCommands?.set(commandName, command);
    console.log(chalk.greenBright(`Registered command "${commandName}"`));
}

const messageTriggerFiles: string[] = fs.readdirSync("./src/events/message").filter(file => file.includes(".js"));

for (const file of messageTriggerFiles) {
    const trigger: ChatTrigger = (await import(`./events/message/${file}`)).default;
    const triggerName = trigger.name;

    bot.messageTriggers?.set(triggerName, trigger);
    console.log(chalk.greenBright(`Registered message trigger "${triggerName}"`));
}

bot.on("kicked", (reason, loggedIn) => console.log(reason.toString(), loggedIn));
bot.on("error", (err) => console.log(err));
