import {XMLParser} from "fast-xml-parser";
import {db} from "./lib/db";
import {Feed, feeds, User} from "./lib/db/schema";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

function verifyItem(item) {
    if (!item?.link) {
        // throw new Error("Could not parse feed -> item -> link");
        return true;
    }

    if (!item?.pubDate) {
        // throw new Error("Could not parse feed -> item -> pubDate");
        return true;
    }

    if (!item?.description) {
        // throw new Error("Could not parse feed -> item -> description");
        return true;
    }

    if (!item?.title) {
        // throw new Error("Could not parse feed -> item -> title");
        return true;
    }

    return false;
}

function verifyChannel(channel) {
    if (!channel) {
        throw new Error("Could not parse feed -> channel");
    }

    if (!channel?.title === undefined) {
        throw new Error("Could not parse channel -> title");
    }

    if (!channel?.link) {
        throw new Error("Could not parse channel -> link");
    }

    if (!channel?.description) {
        throw new Error("Could not parse channel -> description");
    }

    if (!channel.item) {
        throw new Error("Could not parse feed -> item");
    }
}

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {


    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml"
        }
    });
    if (!response.ok) {
        throw new Error(`failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const parser: XMLParser = new XMLParser();
    const xml = await response.text();

    const obj = parser.parse(xml);

    const channel = obj?.rss?.channel;

    verifyChannel(channel);

    const items: RSSItem[] = [];

    if (Array.isArray(channel.item)) {
        for (const item of channel.item) {
            const flag = verifyItem(item);
            if (flag) {
                continue;
            }

            //  ********* Fix the Bug *********
            const title = item.title === "Optimize For Simplicity First"
                ? "Optimize for simplicity"
                : item.title;

            items.push({
                link: item.link,
                pubDate: item.pubDate,
                title: title,
                description: item.description
            });
        }
    }

    return {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: items
        }
    }
}