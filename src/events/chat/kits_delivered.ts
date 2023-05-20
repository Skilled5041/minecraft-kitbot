import { ChatCommand } from "./chat_command.js";
import supabase from "../../utils/supabase.js";

export default <ChatCommand> {
    name: "kitsdelivered",
    description: "Gets the total number of kits delivered.",
    usage: "<prefix>kitsdelivered",
    cooldown: 3000,
    aliases: ["kits_delivered", "kd", "deliveredcount"],
    execute: async (minecraftBot) => {
        const {data: kits_delivered, error: err1} = await supabase
            .from("stats")
            .select("kits_delivered");

        if (err1) console.log(err1);

        minecraftBot.safeChat(`Kits delivered: ${kits_delivered?.[0].kits_delivered}`);
    }
}
