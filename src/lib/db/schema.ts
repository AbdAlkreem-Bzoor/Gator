import {pgTable, timestamp, uuid, text, unique} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    lastFetchedAt: timestamp("last_fetched_at"),
    name: text("name").notNull(),
    url: text("url").unique().notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export type Feed = typeof feeds.$inferSelect;

export const feedFollows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" })
}, (table) => {
    return {
        userFeedUnique: unique().on(table.userId, table.feedId)
    };
});

export type FeedFollow = typeof feedFollows.$inferSelect;

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    title: text("title").notNull(),
    url: text("url").unique().notNull(),
    description: text("description"),
    publishedAt: timestamp("published_at"),
    feedId: uuid("feed_id").notNull().references(() => feeds.id, { onDelete: "cascade" })
});

export type Post = typeof posts.$inferSelect;

