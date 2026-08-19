CREATE TABLE `purchase_order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`ingredientId` int NOT NULL,
	`quantity` decimal(12,2) NOT NULL,
	`receivedQuantity` decimal(12,2) NOT NULL DEFAULT '0',
	`unitPrice` decimal(16,2) NOT NULL,
	`total` decimal(16,2) NOT NULL,
	CONSTRAINT `purchase_order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseCode` varchar(80) NOT NULL,
	`supplierId` int NOT NULL,
	`status` enum('draft','ordered','partially_received','received','cancelled') NOT NULL DEFAULT 'draft',
	`subtotal` decimal(16,2) NOT NULL DEFAULT '0',
	`total` decimal(16,2) NOT NULL DEFAULT '0',
	`expectedAt` timestamp,
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchase_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchase_orders_purchaseCode_unique` UNIQUE(`purchaseCode`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierCode` varchar(40) NOT NULL,
	`name` varchar(180) NOT NULL,
	`phone` varchar(40),
	`email` varchar(160),
	`address` text,
	`taxCode` varchar(40),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `suppliers_supplierCode_unique` UNIQUE(`supplierCode`)
);
--> statement-breakpoint
CREATE INDEX `purchase_order_items_order_idx` ON `purchase_order_items` (`orderId`);--> statement-breakpoint
CREATE INDEX `purchase_order_items_ingredient_idx` ON `purchase_order_items` (`ingredientId`);--> statement-breakpoint
CREATE INDEX `purchase_orders_supplier_idx` ON `purchase_orders` (`supplierId`);--> statement-breakpoint
CREATE INDEX `purchase_orders_status_idx` ON `purchase_orders` (`status`);--> statement-breakpoint
CREATE INDEX `purchase_orders_created_by_idx` ON `purchase_orders` (`createdBy`);--> statement-breakpoint
CREATE INDEX `purchase_orders_created_idx` ON `purchase_orders` (`createdAt`);--> statement-breakpoint
CREATE INDEX `suppliers_created_by_idx` ON `suppliers` (`createdBy`);--> statement-breakpoint
CREATE INDEX `suppliers_name_idx` ON `suppliers` (`name`);--> statement-breakpoint
CREATE INDEX `suppliers_status_idx` ON `suppliers` (`status`);