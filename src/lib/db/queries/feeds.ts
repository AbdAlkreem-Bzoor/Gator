import {db} from "../index.ts";
import {Feed, feedFollows, feeds, users} from "../schema.ts";
import {asc, eq, sql} from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
    const [insertedFeed]: Feed = await db.insert(feeds).values({
        name: name,
        url: url,
        userId: userId
    }).returning();

    return insertedFeed;
}

export async function getFeedByURL(url: string): Promise<Feed> {
    const [result]: Feed = await db.select().from(feeds).where(eq(feeds.url, url)).limit(1);
    return result;
}

export async function getFeeds(): Promise<Feed[]> {
    const result: Feed[] = await db.select().from(feeds);
    return result;
}

export async function markFeedFetched(id: string): Promise<Feed> {
    const [result]: Feed = await db
        .update(feeds)
        .set({lastFetchedAt: new Date()})
        .where(eq(feeds.id, id))
        .returning();

    if (!result) {
        throw new Error(`Could not find feed with id ${id}`);
    }

    return result;
}

export async function getNextFeedToFetch(): Promise<Feed> {
    const [result]: Feed = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(1);

    if (!result) {
        throw new Error(`The feeds table is empty`);
    }

    return result;
}