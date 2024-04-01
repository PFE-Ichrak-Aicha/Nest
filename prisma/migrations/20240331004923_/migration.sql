/*
  Warnings:

  - You are about to drop the `_userfavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_userfavorites` DROP FOREIGN KEY `_UserFavorites_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userfavorites` DROP FOREIGN KEY `_UserFavorites_B_fkey`;

-- DropTable
DROP TABLE `_userfavorites`;

-- CreateTable
CREATE TABLE `PublicationFavorite` (
    `userId` INTEGER NOT NULL,
    `publicationId` INTEGER NOT NULL,
    `idpf` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`idpf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PublicationFavorite` ADD CONSTRAINT `PublicationFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublicationFavorite` ADD CONSTRAINT `PublicationFavorite_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`pubid`) ON DELETE RESTRICT ON UPDATE CASCADE;
