ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Vote" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "User" CASCADE;--> statement-breakpoint
DROP TABLE "Vote" CASCADE;--> statement-breakpoint
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_documentId_documentCreatedAt_Document_id_createdAt_fk";
--> statement-breakpoint
ALTER TABLE "Document" DROP CONSTRAINT "Document_id_createdAt_pk";--> statement-breakpoint
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_id_pk";--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Chat" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Document" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "chatId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Suggestion" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "documentId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "Document" ADD COLUMN "kind" varchar DEFAULT 'text' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_documentId_Document_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Document" DROP COLUMN IF EXISTS "text";--> statement-breakpoint
ALTER TABLE "Suggestion" DROP COLUMN IF EXISTS "documentCreatedAt";