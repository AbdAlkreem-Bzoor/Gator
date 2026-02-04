import {createUser, getUserByName, getUsers} from "../lib/db/queries/users.ts";
import {readConfig, setUser} from "../config.ts";
import {User} from "../lib/db/schema.ts";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`The ${cmdName} command expects a single argument, the username.`);
    }

    const username = args[0];

    if(!(await getUserByName(username))) {
        throw new Error("The username doesn't exist");
    }

    setUser(username);

    console.log(`The user [${username}] has been logged in`);
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`The ${cmdName} command expects a single argument, the username.`);
    }

    const username = args[0];

    const user: User = await createUser(username);
    if (!user) {
        throw new Error("The username already exist");
    }

    setUser(username);

    console.log(`The user [${username}] has been registered`);
}


export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    const users: User[] = await getUsers();

    const currentUserName = readConfig().currentUserName;

    for (const user: User of users) {
        console.log(`* ${user.name} ${user.name === currentUserName ? "(current)" : ""}`);
    }
}