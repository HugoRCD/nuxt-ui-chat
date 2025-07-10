ALTER TABLE "messages" ALTER COLUMN "parts" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "content" text;