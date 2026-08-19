CREATE TABLE `stored_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storageKey` varchar(320) NOT NULL,
	`ownerId` int,
	`referenced` enum('yes','no') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`deletedAt` timestamp,
	CONSTRAINT `stored_files_id` PRIMARY KEY(`id`),
	CONSTRAINT `stored_files_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE INDEX `stored_files_owner_idx` ON `stored_files` (`ownerId`);--> statement-breakpoint
CREATE INDEX `stored_files_reference_idx` ON `stored_files` (`referenced`,`deletedAt`);