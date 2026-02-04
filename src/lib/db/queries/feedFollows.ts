import {db} from "../index.ts";
import {FeedFollow, feedFollows, feeds, users} from "../schema.ts";
import {and, eq} from "drizzle-orm";


export async function createFeedFollow(userId: string, feedId: string) {
    const [newFollow] = await db.insert(feedFollows).values({userId, feedId}).returning();

    const [result] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, newFollow.id));

    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    const result = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, userId));

    return result;
}


export async function deleteFeedFollow(userId: string, feedId: string) {
    const [result] = await db.delete(feedFollows)
                             .where(and(eq(feedFollows.feedId, feedId), eq(feedFollows.userId, userId)))
                             .returning();

    if (!result) {
        throw new Error(`The user didn't follow this feed`);
    }

    return result;
}