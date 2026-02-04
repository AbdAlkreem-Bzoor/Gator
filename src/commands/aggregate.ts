import {fetchFeed, RSSFeed, RSSItem} from "../rss.ts";
import {Feed} from "../lib/db/schema";
import {getNextFeedToFetch, markFeedFetched} from "../lib/db/queries/feeds";
import {createPost} from "../lib/db/queries/posts";

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {

    if (args.length !== 1) {
        throw new Error(`The ${cmdName} command should have one argument`);
    }

    const timeBetweenRequests: number = parseDuration(args[0]);

    console.log(`Collecting feeds every ${args[0]}`);

    await scrapeFeeds();

    const interval = setInterval(async () => {
        await scrapeFeeds();
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error(`The Time Between Requests is not valid!`);
    }

    const value: number = parseFloat(match[1]) * 1000;

    switch (match[2]) {
        case "d":
            return value * 24 * 60 * 60;
        case "h":
            return value * 60 * 60;
        case "m":
            return value * 60;
        default:
            return value;
    }
}

async function scrapeFeeds(): Promise<Feed> {
    const feed: Feed = await getNextFeedToFetch();

    await markFeedFetched(feed.id);

    const feedData: RSSFeed = await fetchFeed(feed.url);

    for (const item: RSSItem of feedData.channel.item) {
        await createPost(item.title, item.link, item.description, item.pubDate, feed.id);
    }

    console.log("Posts saved successfully!");
}
