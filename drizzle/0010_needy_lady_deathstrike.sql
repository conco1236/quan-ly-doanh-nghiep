CREATE TABLE `system_branding` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(160) NOT NULL DEFAULT 'BREWERYOS',
	`tagline` varchar(240) NOT NULL DEFAULT 'He thong quan tri nha may bia',
	`logoKey` varchar(500),
	`logoUrl` varchar(700),
	`logoMimeType` varchar(80),
	`logoSize` int,
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `system_branding_id` PRIMARY KEY(`id`)
);
