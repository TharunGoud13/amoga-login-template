-- First create the User table since other tables depend on it
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- Then create other tables
CREATE TABLE IF NOT EXISTS "Chat" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "visibility" VARCHAR DEFAULT 'private' NOT NULL,
    CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") 
        REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Message" (
    "id" SERIAL PRIMARY KEY,
    "chatId" INTEGER NOT NULL,
    "role" VARCHAR NOT NULL,
    "content" JSON NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Message_chatId_Chat_id_fk" FOREIGN KEY ("chatId") 
        REFERENCES "Chat"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Document" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "kind" VARCHAR DEFAULT 'text' NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Document_userId_User_id_fk" FOREIGN KEY ("userId") 
        REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Suggestion" (
    "id" SERIAL PRIMARY KEY,
    "documentId" INTEGER NOT NULL,
    "originalText" TEXT NOT NULL,
    "suggestedText" TEXT NOT NULL,
    "description" TEXT,
    "isResolved" BOOLEAN DEFAULT FALSE NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    CONSTRAINT "Suggestion_documentId_Document_id_fk" FOREIGN KEY ("documentId") 
        REFERENCES "Document"("id") ON DELETE CASCADE,
    CONSTRAINT "Suggestion_userId_User_id_fk" FOREIGN KEY ("userId") 
        REFERENCES "User"("id") ON DELETE CASCADE
);