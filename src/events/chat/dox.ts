import { ChatCommand } from "./chatCommand.js";
import { faker } from "@faker-js/faker";

export default <ChatCommand>{
    name: "dox",
    description: "Doxxes someone",
    usage: "dox <user>",
    run: (bot, username, args) => {
        const user = args[0];
        if (!user) {
            return bot.chat("Please specify a user to dox");
        }

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

        bot.chat(`${user}'s Info: Name: ${name}, Sex: ${sex}, Age: ${age}, Birthday: ${birthdayString}, Address: ${address}, Coordinates: ${coordinates}, Ip: ${ip}.`);
    }
};
