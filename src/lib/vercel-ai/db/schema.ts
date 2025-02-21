import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  text,
  primaryKey,
  boolean,
  integer,
  serial,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: integer("userId").notNull(), // Maps to user_catalog_id
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: serial("id").primaryKey(),
  chatId: integer("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const document = pgTable("Document", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  kind: varchar("kind", { enum: ["text", "code", "image", "sheet"] })
    .notNull()
    .default("text"),
  userId: integer("userId").notNull(), // Maps to user_catalog_id
});

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable("Suggestion", {
  id: serial("id").primaryKey(),
  documentId: integer("documentId")
    .notNull()
    .references(() => document.id),
  originalText: text("originalText").notNull(),
  suggestedText: text("suggestedText").notNull(),
  description: text("description"),
  isResolved: boolean("isResolved").notNull().default(false),
  userId: integer("userId").notNull(), // Maps to user_catalog_id
  createdAt: timestamp("createdAt").notNull(),
});

export type Suggestion = InferSelectModel<typeof suggestion>;
