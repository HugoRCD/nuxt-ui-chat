CREATE TABLE `chats` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`userId` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `userIdIdx` ON `chats` (`userId`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chatId` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chatIdIdx` ON `messages` (`chatId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text NOT NULL,
	`username` text NOT NULL,
	`provider` text NOT NULL,
	`providerId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_provider_providerId_unique` ON `users` (`provider`,`providerId`);