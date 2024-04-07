/*
  Warnings:

  - You are about to drop the column `userId` on the `subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `subscription` DROP FOREIGN KEY `Subscription_userId_fkey`;

-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `userId`;
