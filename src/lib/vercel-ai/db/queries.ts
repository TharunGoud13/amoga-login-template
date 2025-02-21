import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, eq, desc } from "drizzle-orm";
import { chat, message, document, suggestion } from "./schema";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function saveChat({
  userId,
  title,
}: {
  userId: number;
  title: string;
}) {
  try {
    const [newChat] = await db
      .insert(chat)
      .values({
        createdAt: new Date(),
        userId,
        title,
      })
      .returning();
    return newChat;
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: number }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database", error);
    throw error;
  }
}

export async function getChatById({ id }: { id: number }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function saveMessage({
  chatId,
  role,
  content,
}: {
  chatId: number;
  role: string;
  content: any;
}) {
  try {
    return await db.insert(message).values({
      chatId,
      role,
      content,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to save message in database");
    throw error;
  }
}
