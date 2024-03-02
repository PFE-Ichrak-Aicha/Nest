/*
  Warnings:

  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `Media_pubId_fkey`;

-- DropTable
DROP TABLE `media`;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `publicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`pubid`) ON DELETE RESTRICT ON UPDATE CASCADE;
