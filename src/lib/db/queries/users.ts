import { db } from "../index.ts";
import {User, users} from "../schema.ts";
import {eq} from "drizzle-orm";

export async function createUser(name: string): Promise<User> {
    if(await getUserByName(name)) {
        throw new Error("User already exists");
    }

    const [result]: User = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUserByName(name: string): Promise<User> {
    const [user]: User = await db.select().from(users).where(eq(users.name, name)).limit(1);
    return user;
}

export async function getUserById(id: string): Promise<User> {
    const [user]: User = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
}

export async function truncateUsers() {
    await db.execute("TRUNCATE TABLE users CASCADE");
}

export async function getUsers(): Promise<User[]> {
    const result: User[] = await db.select().from(users);
    return result;
}