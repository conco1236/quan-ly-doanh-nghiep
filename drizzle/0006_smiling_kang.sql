CREATE TABLE `attendance_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`workDate` timestamp NOT NULL,
	`status` enum('present','late','absent','leave','holiday') NOT NULL DEFAULT 'present',
	`checkIn` timestamp,
	`checkOut` timestamp,
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendance_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `attendance_employee_date_unique` UNIQUE(`employeeId`,`workDate`)
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`leaveType` enum('annual','sick','unpaid','other') NOT NULL DEFAULT 'annual',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`totalDays` decimal(6,2) NOT NULL,
	`reason` text,
	`status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
	`approvedBy` int,
	`approvedAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leave_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `attendance_employee_idx` ON `attendance_records` (`employeeId`);--> statement-breakpoint
CREATE INDEX `attendance_work_date_idx` ON `attendance_records` (`workDate`);--> statement-breakpoint
CREATE INDEX `attendance_created_by_idx` ON `attendance_records` (`createdBy`);--> statement-breakpoint
CREATE INDEX `leave_employee_idx` ON `leave_requests` (`employeeId`);--> statement-breakpoint
CREATE INDEX `leave_status_idx` ON `leave_requests` (`status`);--> statement-breakpoint
CREATE INDEX `leave_start_date_idx` ON `leave_requests` (`startDate`);--> statement-breakpoint
CREATE INDEX `leave_created_by_idx` ON `leave_requests` (`createdBy`);