import { handlerLogin, registerCommand, runCommand } from "./config.js";
function main() {
    const [command, ...args] = process.argv.slice(2);
    if (args.length === 0) {
        throw new Error("No command found for command");
    }
    const registery = {};
    registerCommand(registery, command, handlerLogin);
    runCommand(registery, command, ...args);
}
main();
