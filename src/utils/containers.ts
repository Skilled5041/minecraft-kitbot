import chalk from "chalk";
import { Bot } from "mineflayer";

/**
 * Takes a single item from a container
 * @param bot The bot to use
 * @param containers An array of containers to search for
 */
export const takeItemFromContainer = async (bot: Bot, containers: Array<any>) => {
    const chestToOpen = bot.findBlock({
        matching: containers.map(name => bot.registry.blocksByName[name].id),
        maxDistance: 6
    });

    if (!chestToOpen) {
        console.log("No chest found nearby");
        return;
    }

    const chest = await bot.openChest(chestToOpen);

    if (!chest) {
        console.log("Chest could not be opened");
        return;
    }

    const item = chest.slots.find(item => item !== null);

    if (!item) {
        console.log(chest.slots);
        console.log("No item found in chest");
        return;
    }

    await chest.withdraw(item.type, null, item.count);
    await chest.close();

    console.log(`Took ${chalk.red(item.count)} ${chalk.redBright(item.name)} from chest`);
};

const depositAllItemsToChest = (block: Array<any>) => {

};
