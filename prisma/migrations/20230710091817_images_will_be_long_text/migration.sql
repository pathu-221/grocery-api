/*
  Warnings:

  - Made the column `images` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `images` LONGTEXT NOT NULL;
