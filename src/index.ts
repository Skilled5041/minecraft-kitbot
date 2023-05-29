import mineflayer, { BotEvents } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import createTpsPlugin from "mineflayer-tps";
import * as movement from "mineflayer-movement";
import * as fs from "fs";
import chalk from "chalk";
import { ClientEvents, Events, IntentsBitField, WebhookClient } from "discord.js";
import dotenv from "dotenv";
import { MineflayerEvent } from "./events/mineflayer_events.js";
import { createExtendedDiscordClient, createExtendedMinecraftBot } from "./modified_clients.js";
import { DiscordEvent } from "$src/discord_events/discord_event.js";

dotenv.config();

const intents = new IntentsBitField([
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
]);
const discordClient = createExtendedDiscordClient({intents}, {prefixes: ["s!", "S!"], admins: ["313816298461069313"]});
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

void discordClient.login(process.env.DISCORD_BOT_TOKEN);

const minecraftBot = createExtendedMinecraftBot({
    host: "0b0t.org",
    username: "Solarion2",
    version: "1.12.2",
    auth: "microsoft",
}, {
    prefixes: ["&"],
    admins: ["solarion2", "ZSKILLED_"],
});
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

const eventFiles: string[] = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
    const fileName: string = file.split(".")[0];
    const event: MineflayerEvent = (await import(`./events/${fileName}.js`)).default;
    const eventName = event.name;
    const handler = event.handler;

    minecraftBot.on(eventName as keyof BotEvents, handler.bind(null, minecraftBot, discordClient, webhookClient));
    console.log(chalk.blueBright(`Registered event "${eventName}"`));

    if (event.register) {
        event.register(minecraftBot, discordClient, webhookClient);
    }
}

const discordEventFiles: string[] = fs.readdirSync("./src/discord_events").filter(file => file.endsWith(".js"));
for (const file of discordEventFiles) {
    const fileName: string = file.split(".")[0];
    const event: DiscordEvent = (await import(`./discord_events/${fileName}.js`)).default;
    const eventName = event.event;
    const handler = event.handler;

    discordClient.on(eventName as keyof ClientEvents, handler.bind(null, minecraftBot, discordClient, webhookClient));
    console.log(chalk.blueBright(`Registered discord event "${eventName}"`));

    if (event.register) {
        event.register(minecraftBot, discordClient, webhookClient);
    }
}
