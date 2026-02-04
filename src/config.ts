import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    currentUserName: string;
    dbUrl: string;
};

export function setUser(userName: string): void {
    const cfg: Config = readConfig();

    cfg.currentUserName = userName;

    writeConfig(cfg);
}

export function readConfig(): Config {
    const configPath: string = getConfigFilePath();

    const rawConfig: string = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
    const homePath: string = os.homedir();
    const configFileName = ".gatorconfig.json";

    return path.join(homePath, configFileName);
}


function writeConfig(cfg: Config): void {
    const configPath: string = getConfigFilePath();

    const rawConfig: string = JSON.stringify({
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    });

    fs.writeFileSync(configPath, rawConfig, { encoding: "utf-8" });
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig !== "object" || rawConfig === null) {
        throw new Error("Config must be an object");
    }

    if (typeof rawConfig.db_url !== "string") {
        throw new Error("db_url must be a string");
    }

    if (typeof rawConfig.current_user_name !== "string") {
        throw new Error("current_user_name must be a string");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };
}




































