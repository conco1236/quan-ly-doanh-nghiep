CREATE TABLE `access_policies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`allowedCidrs` text NOT NULL,
	`outsideMode` enum('deny','read_only') NOT NULL DEFAULT 'read_only',
	`enabled` enum('yes','no') NOT NULL DEFAULT 'yes',
	`createdBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `access_policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tableName` varchar(100) NOT NULL,
	`recordId` varchar(80) NOT NULL,
	`action` enum('create','update','delete','batch_insert','workflow') NOT NULL,
	`fieldName` varchar(100),
	`oldValue` text,
	`newValue` text,
	`actorId` int,
	`ipAddress` varchar(64),
	`deviceId` varchar(160),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `device_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(160) NOT NULL,
	`fingerprintHash` varchar(128),
	`lastIp` varchar(64),
	`status` enum('pending','approved','blocked') NOT NULL DEFAULT 'pending',
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `device_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qc_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`batchId` int NOT NULL,
	`fieldKey` varchar(80) NOT NULL,
	`value` decimal(12,4) NOT NULL,
	`status` enum('pass','warning','fail') NOT NULL,
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `qc_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qc_standards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beerTypeId` int NOT NULL,
	`fieldKey` varchar(80) NOT NULL,
	`label` varchar(160) NOT NULL,
	`minValue` decimal(12,4),
	`maxValue` decimal(12,4),
	`unit` varchar(32),
	`createdBy` int,
	CONSTRAINT `qc_standards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflow_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`entityType` varchar(80) NOT NULL,
	`entityId` varchar(80) NOT NULL,
	`assigneeId` int,
	`status` enum('open','in_progress','done','cancelled') NOT NULL DEFAULT 'open',
	`dueAt` timestamp,
	`lastNotifiedAt` timestamp,
	`scheduleCronTaskUid` varchar(65),
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflow_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `beer_types` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `customers` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `ingredients` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `production_steps` ADD `createdBy` int;--> statement-breakpoint
ALTER TABLE `recipes` ADD `createdBy` int;--> statement-breakpoint
CREATE INDEX `audit_logs_record_idx` ON `audit_logs` (`tableName`,`recordId`);--> statement-breakpoint
CREATE INDEX `audit_logs_actor_idx` ON `audit_logs` (`actorId`);--> statement-breakpoint
CREATE INDEX `audit_logs_created_idx` ON `audit_logs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `device_sessions_user_idx` ON `device_sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `device_sessions_device_idx` ON `device_sessions` (`deviceId`);--> statement-breakpoint
CREATE INDEX `qc_results_batch_idx` ON `qc_results` (`batchId`);--> statement-breakpoint
CREATE INDEX `qc_results_status_idx` ON `qc_results` (`status`);--> statement-breakpoint
CREATE INDEX `qc_standards_beer_field_idx` ON `qc_standards` (`beerTypeId`,`fieldKey`);--> statement-breakpoint
CREATE INDEX `workflow_tasks_status_idx` ON `workflow_tasks` (`status`);--> statement-breakpoint
CREATE INDEX `workflow_tasks_assignee_idx` ON `workflow_tasks` (`assigneeId`);--> statement-breakpoint
CREATE INDEX `workflow_tasks_task_uid_idx` ON `workflow_tasks` (`scheduleCronTaskUid`);--> statement-breakpoint
CREATE INDEX `beer_types_created_by_idx` ON `beer_types` (`createdBy`);--> statement-breakpoint
CREATE INDEX `beer_types_name_idx` ON `beer_types` (`name`);--> statement-breakpoint
CREATE INDEX `customers_created_by_idx` ON `customers` (`createdBy`);--> statement-breakpoint
CREATE INDEX `customers_phone_idx` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `ingredients_created_by_idx` ON `ingredients` (`createdBy`);--> statement-breakpoint
CREATE INDEX `ingredients_name_idx` ON `ingredients` (`name`);--> statement-breakpoint
CREATE INDEX `inventory_transactions_ingredient_idx` ON `inventory_transactions` (`ingredientId`);--> statement-breakpoint
CREATE INDEX `inventory_transactions_created_idx` ON `inventory_transactions` (`createdAt`);--> statement-breakpoint
CREATE INDEX `production_batches_created_by_idx` ON `production_batches` (`createdBy`);--> statement-breakpoint
CREATE INDEX `production_batches_status_idx` ON `production_batches` (`status`);--> statement-breakpoint
CREATE INDEX `production_batches_created_idx` ON `production_batches` (`createdAt`);--> statement-breakpoint
CREATE INDEX `production_steps_batch_idx` ON `production_steps` (`batchId`);--> statement-breakpoint
CREATE INDEX `recipes_beer_idx` ON `recipes` (`beerTypeId`);--> statement-breakpoint
CREATE INDEX `recipes_ingredient_idx` ON `recipes` (`ingredientId`);--> statement-breakpoint
CREATE INDEX `sales_order_items_order_idx` ON `sales_order_items` (`orderId`);--> statement-breakpoint
CREATE INDEX `sales_orders_created_by_idx` ON `sales_orders` (`createdBy`);--> statement-breakpoint
CREATE INDEX `sales_orders_status_idx` ON `sales_orders` (`status`);--> statement-breakpoint
CREATE INDEX `sales_orders_created_idx` ON `sales_orders` (`createdAt`);