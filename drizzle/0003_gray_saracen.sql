ALTER TABLE `customers` ADD `provinceCode` varchar(16);--> statement-breakpoint
ALTER TABLE `customers` ADD `districtCode` varchar(16);--> statement-breakpoint
CREATE INDEX `customers_location_idx` ON `customers` (`provinceCode`,`districtCode`);