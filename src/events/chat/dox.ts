import { ChatCommand } from "./chat_command.js";
import { faker } from "@faker-js/faker";
import { sanitise } from "../../utils/safety.js";

export default <ChatCommand>{
    name: "dox",
    description: "Doxxes someone",
    cooldown: 10000,
    usage: "dox <user>",
    execute: (minecraftBot, username, args) => {
        let user = args[0];
        if (!user) {
            return minecraftBot.safeChat("Please specify a user to dox");
        }

        user = sanitise(user);

        const ip = faker.internet.ip();
        const sex = faker.person.sex();
        const name = faker.person.fullName({sex: sex as "male" | "female"});
        const birthday = faker.date.birthdate({max: 2011, min: 1973, mode: "year"});
        const birthdayString = birthday.toDateString();
        const age = Math.floor((new Date().getTime() - birthday.getTime()) / 31556952000);
        const address = faker.location.streetAddress(true);
        const coordinates = faker.location.nearbyGPSCoordinate({
            isMetric: true,
        });

        minecraftBot.safeChat(`${user}'s Info: Name: ${name}, Sex: ${sex}, Age: ${age}, Birthday: ${birthdayString}, Address: ${address}, Coordinates: ${coordinates}, Ip: ${ip}.`);
    }
};
