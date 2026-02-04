import {truncateUsers} from "../lib/db/queries/users.ts";

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    await truncateUsers();

    console.log("The users table have been truncated!");
}