import {fetchFeed, RSSFeed, RSSItem} from "../rss";
import {Feed, FeedFollow, User} from "../lib/db/schema";
import {Config, readConfig} from "../config";
import {getUserByName} from "../lib/db/queries/users";
import {getFeedByURL} from "../lib/db/queries/feeds";
import {createFeedFollow, deleteFeedFollow, getFeedFollowsForUser} from "../lib/db/queries/feedFollows";


export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {

    if (args.length !== 1) {
        throw new Error(`The ${cmdName} command should have one argument`);
    }

    const config: Config = readConfig();

    const url: string = args[0];
    const feed: Feed = await getFeedByURL(url);
    if (!feed) {
        throw new Error(`Feed not found for url: ${url}`);
    }

    const result = await createFeedFollow(user.id, feed.id);

    console.log(result);
    console.log(`* Feed Name: ${result.feedName}`);
    console.log(`* User Name: ${result.userName}`);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 0) {
        throw new Error(`The ${cmdName} command shouldn't have arguments`);
    }

    const result = await getFeedFollowsForUser(user.id);

    for (const entity of result) {
        console.log(`* Feed Name: ${entity.feedName}`);
    }
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length !== 1) {
        throw new Error(`The ${cmdName} command should one argument`);
    }

    const url: string = args[0];

    const feed: Feed = await getFeedByURL(url);
    if (!feed) {
        throw new Error(`Feed not found for url: ${url}`);
    }

    const result: FeedFollow = await deleteFeedFollow(user.id, feed.id);
    if (!result) {
        throw new Error(`Failed to unfollow feed: ${url}`);
    }

    console.log(`%s unfollowed successfully!`, feed.name);
}