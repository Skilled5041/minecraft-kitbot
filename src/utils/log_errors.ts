import fs from "fs";

export const logErrors = (error: string) => {
    // Save to logs/errors.txt
    fs.appendFile("./logs/errors.txt", error + "\n", (err) => {
        if (err) console.log(err);
    });
};

export const logToFile = (log: string, file: string) => {
    fs.appendFile(file, log + "\n", (err) => {
        if (err) console.log(err);
    });
};
