import {Feed, FeedFollow, Post, User} from "../lib/db/schema";
import {getFeedByURL} from "../lib/db/queries/feeds";
import {deleteFeedFollow} from "../lib/db/queries/feedFollows";
import {getPostsForUser} from "../lib/db/queries/posts";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 0 && args.length !== 1) {
        throw new Error(`The ${cmdName} command should have one argument`);
    }

    const postsLimit: number = args.length === 1 ? parseInt(args[1]) : 2;

    const posts: Post[] = await getPostsForUser(user.id, postsLimit);

    console.log(`Found ${posts.length} posts for user ${user.name}`);
    for (let post of posts) {
        console.log(`${post.publishedAt} from ${post.feedName}`);
        console.log(`--- ${post.title} ---`);
        console.log(`    ${post.description}`);
        console.log(`Link: ${post.url}`);
        console.log(`=====================================`);
    }
}