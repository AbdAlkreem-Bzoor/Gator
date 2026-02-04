import fs from "fs";
import os from "os";
import path from "path";
export function setUser(userName) {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}
export function readConfig() {
    const configPath = getConfigFilePath();
    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return validateConfig(rawConfig);
}
function getConfigFilePath() {
    const homePath = os.homedir();
    const configFileName = ".gatorconfig.json";
    return path.join(homePath, configFileName);
}
function writeConfig(cfg) {
    const configPath = getConfigFilePath();
    const rawConfig = JSON.stringify({
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    });
    fs.writeFileSync(configPath, rawConfig, { encoding: "utf-8" });
}
function validateConfig(rawConfig) {
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
export function handlerLogin(cmdName, ...args) {
    if (args.length === 0) {
        throw new Error("The login handler expects a single argument, the username.");
    }
    const username = args[0];
    setUser(username);
    console.log(`The user [${username}] has been set`);
}
export function registerCommand(registry, cmdName, handler) {
    registry[cmdName] = handler;
}
export function runCommand(registry, cmdName, ...args) {
    const handler = registry[cmdName];
    handler(cmdName, ...args);
}
