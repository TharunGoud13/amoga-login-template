-- Drop existing tables if they exist
DROP TABLE IF EXISTS "Suggestion" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Document" CASCADE;
DROP TABLE IF EXISTS "Chat" CASCADE;

CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- Create new tables with integer IDs
CREATE TABLE "Chat" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "visibility" VARCHAR DEFAULT 'private' NOT NULL
);

CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "chatId" INTEGER NOT NULL,
    "role" VARCHAR NOT NULL,
    "content" JSON NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE
);

CREATE TABLE "Document" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "kind" VARCHAR DEFAULT 'text' NOT NULL,
    "userId" INTEGER NOT NULL
);

CREATE TABLE "Suggestion" (
    "id" SERIAL PRIMARY KEY,
    "documentId" INTEGER NOT NULL,
    "originalText" TEXT NOT NULL,
    "suggestedText" TEXT NOT NULL,
    "description" TEXT,
    "isResolved" BOOLEAN DEFAULT FALSE NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE
);