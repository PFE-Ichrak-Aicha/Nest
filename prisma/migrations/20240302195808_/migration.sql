/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `Publication` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `publication` ADD COLUMN `videoId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Video` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Publication_videoId_key` ON `Publication`(`videoId`);

-- AddForeignKey
ALTER TABLE `Publication` ADD CONSTRAINT `Publication_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
