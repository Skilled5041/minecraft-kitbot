import { ChatCommand } from "./cat_command.js";
import { faker } from "@faker-js/faker";

export default <ChatCommand>{
    name: "creditcard",
    usage: "creditcard",
    description: "Gives you information of a random credit card.",
    aliases: ["cc", "credit", "credit-card", "credit_card"],
    execute: (bot) => {
        const issuer = faker.finance.creditCardIssuer();
        const cardNumber = faker.finance.creditCardNumber({issuer});
        const cvv = faker.finance.creditCardCVV();
        const cardHolder = faker.person.fullName();
        const expire = faker.date.future({years: 5});
        const expireMonth = expire.getMonth() + 1;
        const expireYear = expire.getFullYear();

        bot.chat(`Issuer: ${issuer}, Card Number: ${cardNumber}, CVV: ${cvv}, Card Holder: ${cardHolder}, Expire: ${expireMonth}/${expireYear.toString().substring(2)}`);
    }
};
