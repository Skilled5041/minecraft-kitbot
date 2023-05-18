import { ChatCommand } from "./cat_command.js";
import supabase from "../../utils/supabase.js";

export default <ChatCommand> {
    name: "kitsdelivered",
    description: "Gets the total number of kits delivered.",
    usage: "<prefix>kitsdelivered",
    aliases: ["kits_delivered", "kd", "deliveredcount"],
    execute: async (bot) => {
        const {data: kits_delivered, error: err1} = await supabase
            .from("stats")
            .select("kits_delivered");

        if (err1) console.log(err1);

        bot.chat(`Kits delivered: ${kits_delivered?.[0].kits_delivered}`);
    }
}
