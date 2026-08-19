CREATE TABLE `maintenance_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetCode` varchar(50) NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` varchar(100),
	`location` varchar(160),
	`status` enum('active','maintenance','inactive') NOT NULL DEFAULT 'active',
	`installedAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `maintenance_assets_assetCode_unique` UNIQUE(`assetCode`)
);
--> statement-breakpoint
CREATE TABLE `maintenance_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`frequencyDays` int NOT NULL,
	`nextDueAt` timestamp NOT NULL,
	`lastCompletedAt` timestamp,
	`status` enum('active','paused') NOT NULL DEFAULT 'active',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `maintenance_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketCode` varchar(80) NOT NULL,
	`assetId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','resolved','cancelled') NOT NULL DEFAULT 'open',
	`cost` decimal(16,2) NOT NULL DEFAULT '0',
	`openedAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenance_tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `maintenance_tickets_ticketCode_unique` UNIQUE(`ticketCode`)
);
--> statement-breakpoint
CREATE INDEX `maintenance_assets_created_by_idx` ON `maintenance_assets` (`createdBy`);--> statement-breakpoint
CREATE INDEX `maintenance_assets_status_idx` ON `maintenance_assets` (`status`);--> statement-breakpoint
CREATE INDEX `maintenance_schedules_asset_idx` ON `maintenance_schedules` (`assetId`);--> statement-breakpoint
CREATE INDEX `maintenance_schedules_due_idx` ON `maintenance_schedules` (`nextDueAt`);--> statement-breakpoint
CREATE INDEX `maintenance_schedules_created_by_idx` ON `maintenance_schedules` (`createdBy`);--> statement-breakpoint
CREATE INDEX `maintenance_tickets_asset_idx` ON `maintenance_tickets` (`assetId`);--> statement-breakpoint
CREATE INDEX `maintenance_tickets_status_idx` ON `maintenance_tickets` (`status`);--> statement-breakpoint
CREATE INDEX `maintenance_tickets_priority_idx` ON `maintenance_tickets` (`priority`);--> statement-breakpoint
CREATE INDEX `maintenance_tickets_created_by_idx` ON `maintenance_tickets` (`createdBy`);