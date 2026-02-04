import {handlerLogin, handlerRegister, handlerUsers} from "./users.ts";
import {handlerReset} from "./reset.ts";
import {handlerAgg} from "./aggregate.ts";
import {handlerAddFeed, handlerFeeds} from "./feeds.ts";
import {handlerFollow, handlerFollowing, handlerUnfollow} from "./feedFollows";
import {User} from "../lib/db/schema";
import {middlewareLoggedIn} from "../middlewares";
import {handlerBrowse} from "./browses";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

export function addCommands() : CommandsRegistry{
    const registry: CommandsRegistry = {};

    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(registry, "unfollow", middlewareLoggedIn(handlerUnfollow));
    registerCommand(registry, "browse", middlewareLoggedIn(handlerBrowse));

    return registry;
}

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const handler: CommandHandler = registry[cmdName];

    await handler(cmdName, ...args);
}