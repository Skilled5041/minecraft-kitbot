export const sanitise = (message: string) => {
    return message.replace("/", "╱");
}

export const filterRegexes = [/\$\{.*}/];
export const filterStrings = ["§"];
