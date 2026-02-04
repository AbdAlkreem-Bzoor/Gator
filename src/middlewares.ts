import {CommandHandler, UserCommandHandler} from "./commands/commands.ts";
import {readConfig} from "./config.ts";
import {getUserByName} from "./lib/db/queries/users.ts";


export type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const config = readConfig();

        const user = await getUserByName(config.currentUserName);
        if (!user) {
            throw new Error(`Please login first.`);
        }

        return await handler(cmdName, user, ...args);
    };
}
