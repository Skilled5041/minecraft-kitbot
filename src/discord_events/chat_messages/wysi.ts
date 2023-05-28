import { DiscordChatTrigger } from "$src/discord_events/chat_messages/discord_chat_message.js";
import { EmbedBuilder } from "discord.js";

export default <DiscordChatTrigger>{
    name: "wysi",
    description: "727 WYSI",
    trigger(minecraftBot, discordClient, webhookClient, message) {
        return message.content.includes("727");
    },
    async execute(minecraftBot, discordClient, webhookClient, message) {
        await message.reply({
            embeds: [new EmbedBuilder()
                .setColor(0x0006a6)
                .setDescription("727 WYSI")]
            , allowedMentions: {repliedUser: false}
        });
    }
};
