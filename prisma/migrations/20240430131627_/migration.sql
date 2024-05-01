/*
  Warnings:

  - You are about to drop the column `expertId` on the `expertrequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `expertrequest` DROP FOREIGN KEY `ExpertRequest_expertId_fkey`;

-- AlterTable
ALTER TABLE `expertrequest` DROP COLUMN `expertId`;
