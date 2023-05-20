import fs from "fs";

export const logErrors = (error: string) => {
    // Save to logs/errors.txt
    fs.appendFile("./logs/errors.txt", error + "\n", (err) => {
        console.log(err);
    });
};
