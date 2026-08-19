CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeCode` varchar(40) NOT NULL,
	`fullName` varchar(160) NOT NULL,
	`phone` varchar(40),
	`email` varchar(160),
	`address` text,
	`department` varchar(120) NOT NULL,
	`position` varchar(120) NOT NULL,
	`employmentStatus` enum('active','on_leave','terminated') NOT NULL DEFAULT 'active',
	`hireDate` timestamp,
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_employeeCode_unique` UNIQUE(`employeeCode`)
);
--> statement-breakpoint
CREATE INDEX `employees_created_by_idx` ON `employees` (`createdBy`);--> statement-breakpoint
CREATE INDEX `employees_department_idx` ON `employees` (`department`);--> statement-breakpoint
CREATE INDEX `employees_status_idx` ON `employees` (`employmentStatus`);--> statement-breakpoint
CREATE INDEX `employees_name_idx` ON `employees` (`fullName`);