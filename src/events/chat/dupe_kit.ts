import { ChatCommand } from "./chat_command.js";
import { takeItemFromContainer } from "$src/utils/containers.js";
import { waitForMinecraftReply } from "$src/utils/wait_for_minecraft_reply.js";
import supabase from "$src/utils/supabase.js";
import { getCurrentUTCDate } from "$src/utils/date.js";
import { logErrors } from "$src/utils/log_errors.js";

export default <ChatCommand>{
    name: "dupekit",
    description: "Gives you a dupe kit.",
    usage: "<prefix>dupekit",
    // whitelistedOnly: true,
    cooldown: 10000,
    aliases: ["dupe", "dk"],
    // TODO: Error handling
    execute: async (minecraftBot, discordClient, webhookClient, username) => {
        await takeItemFromContainer(minecraftBot, ["chest", "trapped_chest"]);
        minecraftBot.safeChat(`/tpa ${username}`);
        await waitForMinecraftReply(minecraftBot, discordClient, webhookClient, 5000, async (minecraftBot, discordClient, webhookClient, message) => {
            if (message.startsWith("Teleported to")) {
                minecraftBot.safeChat("/kill");

                const {data: kits_delivered, error: err1} = await supabase
                    .from("stats")
                    .select("kits_delivered");

                if (err1) logErrors(err1.message);


                const {error: err2} = await supabase
                    .from("stats")
                    .update({kits_delivered: kits_delivered?.[0].kits_delivered + 1, last_updated: Date.now()})
                    .eq("id", "1");

                if (err2) logErrors(err2.message);

                const currentDate = getCurrentUTCDate();


                const {data: daily_kits_delivered, error: err3} = await supabase
                    .from("daily_kits_delivered")
                    .select("kits_delivered")
                    .eq("day", currentDate);

                if (err3) logErrors(err3.message);

                const {error: err4} = await supabase
                    .from("daily_kits_delivered")
                    .update({kits_delivered: daily_kits_delivered?.[0].kits_delivered + 1})
                    .eq("day", currentDate);

                if (err4) logErrors(err4.message);

                return true;
            }
            return false;
        }).catch(() => {
        });
    }
};
