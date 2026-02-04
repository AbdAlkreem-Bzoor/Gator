import {Feed, feedFollows, feeds, Post, posts, users} from "../schema";
import {db} from "../index";
import {desc, eq} from "drizzle-orm";


export async function createPost(title: string, url: string, description: string,
                                 publishedAt: string, feedId: string): Promise<Post> {
    const [insertedPost]: Feed = await db.insert(feeds).values({
        title: title,
        url: url,
        description: description,
        publishedAt: publishedAt,
        feedId: feedId
    }).returning();

    return insertedPost;
}

export async function getPostsForUser(userId: string, postsLimit: number = 2): Promise<Post[]> {
    const result: Post[] = await db
        .select({
            id: posts.id,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            title: posts.title,
            url: posts.url,
            description: posts.description,
            publishedAt: posts.publishedAt,
            feedId: posts.feedId,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(posts, eq(feeds.id, posts.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(postsLimit);

    return result;
}