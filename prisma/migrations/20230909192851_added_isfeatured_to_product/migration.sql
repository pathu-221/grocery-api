-- AlterTable
ALTER TABLE `products` ADD COLUMN `is_featured` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';
