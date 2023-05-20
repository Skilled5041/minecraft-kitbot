import mineflayer, { BotEvents } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import * as movement from "mineflayer-movement";
import * as fs from "fs";
import chalk from "chalk";
import { ChatCommand } from "./events/chat/chat_command.js";
import { ChatTrigger } from "./events/message/message_trigger.js";
import createTpsPlugin from "mineflayer-tps";
import { Events, IntentsBitField, WebhookClient } from "discord.js";
import { SlashCommand } from "./slash_commands/slash_command.js";
import dotenv from "dotenv";
import { MineflayerEvent } from "./events/mineflayer_events.js";
import { createExtendedMinecraftBot, createExtendedDiscordClient } from "./modified_clients.js";

export type UserStatus = "blacklisted" | "whitelisted" | "normal";

dotenv.config();

const intents = new IntentsBitField([IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages]);
const discordClient = createExtendedDiscordClient({intents});
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
    username: "solarion2",
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

const eventFiles: string[] = fs.readdirSync("./src/events").filter(file => file.includes(".js"));
for (const file of eventFiles) {
    const fileName: string = file.split(".")[0];
    const event: MineflayerEvent = (await import(`./events/${fileName}.js`)).default;
    const eventName = event.name;
    const handler = event.handler;

    minecraftBot.on(eventName as keyof BotEvents, handler.bind(null, minecraftBot, discordClient, webhookClient));
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

    if (await discordClient.getDiscordUserStatus(interaction.user.id) === "blacklisted" && interaction.user.id !== "313816298461069313") {
        return;
    }

    const command = discordClient.slashCommands.get(interaction.commandName);

    if (!command) return;

    if (command.ownerOnly && interaction.user.id !== "313816298461069313") {
        return void await interaction.reply({
            content: "You do not have permission to use this command!",
            ephemeral: true
        });
    }

    if (command.whitelistOnly && discordClient.userStatus.get(interaction.user.id) !== "whitelisted") {
        return void await interaction.reply({
            content: "You do not have permission to use this command!",
            ephemeral: true
        });
    }

    if (Date.now() - (discordClient.lastUserMessageTime.get(interaction.user.id) ?? 0) < 2000) {
        return void await interaction.reply({
            content: "Please wait a while before using another command!",
            ephemeral: true
        });
    }

    discordClient.lastUserMessageTime.set(interaction.user.id, Date.now());

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
