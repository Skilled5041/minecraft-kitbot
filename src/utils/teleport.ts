import { Bot } from "mineflayer";
import supabase from "./supabase.js";

export const waitForTPAccept = async (bot: Bot, message: any) => {
    if (message.extra?.[0].toString() === "Teleported to ") {
        bot.chat("/kill");
        bot.removeListener("message", waitForTPAccept.bind(null, bot));

        const {data: kits_delivered, error: err1} = await supabase
            .from("stats")
            .select("kits_delivered");

        if (err1) console.log(err1);


        const {error: err2} = await supabase
            .from("stats")
            .update({kits_delivered: kits_delivered?.[0].kits_delivered + 1})
            .eq("id", "1");

        if (err2) console.log(err2);

        const {error: err3} = await supabase
            .from("stats")
            .update({last_updated: Date.now()})
            .eq("id", "1");

        if (err3) console.log(err3);

    } else if (message.toString().startsWith("Your teleport request to")) {
        bot.removeListener("message", waitForTPAccept.bind(null, bot));
    }
};
