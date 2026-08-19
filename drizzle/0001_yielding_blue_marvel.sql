CREATE TABLE `beer_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beerTypeId` int NOT NULL,
	`sku` varchar(80) NOT NULL,
	`name` varchar(160) NOT NULL,
	`unit` varchar(32) NOT NULL DEFAULT 'thùng',
	`price` decimal(14,2) NOT NULL DEFAULT '0',
	`stockQuantity` decimal(12,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `beer_products_id` PRIMARY KEY(`id`),
	CONSTRAINT `beer_products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `beer_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text,
	`abv` decimal(5,2) NOT NULL DEFAULT '0',
	`color` varchar(80),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `beer_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`phone` varchar(40),
	`address` text,
	`email` varchar(160),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`unit` varchar(32) NOT NULL,
	`stockQuantity` decimal(12,2) NOT NULL DEFAULT '0',
	`lowStockThreshold` decimal(12,2) NOT NULL DEFAULT '0',
	`supplier` varchar(160),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ingredients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ingredientId` int NOT NULL,
	`type` enum('in','out') NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`reference` varchar(160),
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventory_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `production_batches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`batchCode` varchar(80) NOT NULL,
	`beerTypeId` int NOT NULL,
	`plannedQuantity` decimal(12,2) NOT NULL,
	`actualQuantity` decimal(12,2) NOT NULL DEFAULT '0',
	`status` enum('planned','in_progress','completed','cancelled') NOT NULL DEFAULT 'planned',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `production_batches_id` PRIMARY KEY(`id`),
	CONSTRAINT `production_batches_batchCode_unique` UNIQUE(`batchCode`)
);
--> statement-breakpoint
CREATE TABLE `production_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`batchId` int NOT NULL,
	`stepType` enum('mashing','fermentation','filtration','bottling') NOT NULL,
	`status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`note` text,
	CONSTRAINT `production_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`beerTypeId` int NOT NULL,
	`ingredientId` int NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`unit` varchar(32) NOT NULL,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`unitPrice` decimal(14,2) NOT NULL,
	`total` decimal(14,2) NOT NULL,
	CONSTRAINT `sales_order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderCode` varchar(80) NOT NULL,
	`customerId` int NOT NULL,
	`status` enum('new','processing','completed','cancelled') NOT NULL DEFAULT 'new',
	`subtotal` decimal(14,2) NOT NULL DEFAULT '0',
	`discount` decimal(14,2) NOT NULL DEFAULT '0',
	`total` decimal(14,2) NOT NULL DEFAULT '0',
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sales_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `sales_orders_orderCode_unique` UNIQUE(`orderCode`)
);
