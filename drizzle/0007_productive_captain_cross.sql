CREATE TABLE `finance_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(40) NOT NULL,
	`name` varchar(160) NOT NULL,
	`accountType` enum('cash','bank','other') NOT NULL DEFAULT 'cash',
	`openingBalance` decimal(16,2) NOT NULL DEFAULT '0',
	`currentBalance` decimal(16,2) NOT NULL DEFAULT '0',
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `finance_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `finance_accounts_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `finance_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transactionCode` varchar(80) NOT NULL,
	`accountId` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`category` varchar(120) NOT NULL,
	`amount` decimal(16,2) NOT NULL,
	`transactionDate` timestamp NOT NULL,
	`counterparty` varchar(180),
	`referenceType` varchar(80),
	`referenceId` int,
	`status` enum('draft','posted','cancelled') NOT NULL DEFAULT 'posted',
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `finance_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `finance_transactions_transactionCode_unique` UNIQUE(`transactionCode`)
);
--> statement-breakpoint
CREATE TABLE `payables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentCode` varchar(80) NOT NULL,
	`supplierName` varchar(180) NOT NULL,
	`dueDate` timestamp,
	`amount` decimal(16,2) NOT NULL,
	`paidAmount` decimal(16,2) NOT NULL DEFAULT '0',
	`status` enum('open','partial','paid','cancelled') NOT NULL DEFAULT 'open',
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payables_id` PRIMARY KEY(`id`),
	CONSTRAINT `payables_documentCode_unique` UNIQUE(`documentCode`)
);
--> statement-breakpoint
CREATE TABLE `receivables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentCode` varchar(80) NOT NULL,
	`customerId` int,
	`orderId` int,
	`dueDate` timestamp,
	`amount` decimal(16,2) NOT NULL,
	`paidAmount` decimal(16,2) NOT NULL DEFAULT '0',
	`status` enum('open','partial','paid','cancelled') NOT NULL DEFAULT 'open',
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `receivables_id` PRIMARY KEY(`id`),
	CONSTRAINT `receivables_documentCode_unique` UNIQUE(`documentCode`)
);
--> statement-breakpoint
CREATE INDEX `finance_accounts_created_by_idx` ON `finance_accounts` (`createdBy`);--> statement-breakpoint
CREATE INDEX `finance_accounts_status_idx` ON `finance_accounts` (`status`);--> statement-breakpoint
CREATE INDEX `finance_transactions_account_idx` ON `finance_transactions` (`accountId`);--> statement-breakpoint
CREATE INDEX `finance_transactions_type_date_idx` ON `finance_transactions` (`type`,`transactionDate`);--> statement-breakpoint
CREATE INDEX `finance_transactions_status_idx` ON `finance_transactions` (`status`);--> statement-breakpoint
CREATE INDEX `finance_transactions_created_by_idx` ON `finance_transactions` (`createdBy`);--> statement-breakpoint
CREATE INDEX `payables_supplier_idx` ON `payables` (`supplierName`);--> statement-breakpoint
CREATE INDEX `payables_status_idx` ON `payables` (`status`);--> statement-breakpoint
CREATE INDEX `payables_created_by_idx` ON `payables` (`createdBy`);--> statement-breakpoint
CREATE INDEX `receivables_customer_idx` ON `receivables` (`customerId`);--> statement-breakpoint
CREATE INDEX `receivables_order_idx` ON `receivables` (`orderId`);--> statement-breakpoint
CREATE INDEX `receivables_status_idx` ON `receivables` (`status`);--> statement-breakpoint
CREATE INDEX `receivables_created_by_idx` ON `receivables` (`createdBy`);