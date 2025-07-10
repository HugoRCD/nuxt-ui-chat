ALTER TABLE "messages" RENAME COLUMN "content" TO "parts";--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachments" json DEFAULT '[]' NOT NULL;