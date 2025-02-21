CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
