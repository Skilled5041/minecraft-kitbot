import { DiscordChatCommand } from "$src/discord_events/chat_commands/discord_chat_command.js";
import { ColorResolvable, EmbedBuilder } from "discord.js";

export default <DiscordChatCommand>{
    name: "ping",
    description: "Replies with the ping of the bot.",
    usage: "ping",
    cooldown: 1000,
    async execute(minecraftBot, discordClient, webhookClient, message) {
        const reply = await message.reply({
            embeds: [new EmbedBuilder()
                .setTitle("Pong!")
                .setDescription(`API Latency: ${discordClient.ws.ping > 1 ? `${discordClient.ws.ping} ms` : "calculating..."}\nLatency: calculating...`)
            ]
        });

        const latency = reply.createdTimestamp - message.createdTimestamp;
        let colour: ColorResolvable;
        switch (true) {
            case latency < 250: {
                colour = "Green";
                break;
            }
            case latency < 400: {
                colour = "Yellow";
                break;
            }
            default: {
                colour = "Red";
                break;
            }
        }

        await reply.edit({
            embeds: [new EmbedBuilder()
                .setTitle("Pong!")
                .setDescription(`API Latency: ${discordClient.ws.ping > 1 ? `${discordClient.ws.ping} ms` : "calculating..."}\nLatency: ${latency} ms`)
                .setColor(colour)
            ],
            allowedMentions: {repliedUser: false}
        });
    }
};
