/*
  Warnings:

  - You are about to drop the column `equippement` on the `publication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `publication` DROP COLUMN `equippement`;

-- CreateTable
CREATE TABLE `Equippement` (
    `equipid` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`equipid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EquippementPublication` (
    `idep` INTEGER NOT NULL AUTO_INCREMENT,
    `publicationId` INTEGER NOT NULL,
    `equippementId` INTEGER NOT NULL,

    PRIMARY KEY (`idep`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EquippementPublication` ADD CONSTRAINT `EquippementPublication_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`pubid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquippementPublication` ADD CONSTRAINT `EquippementPublication_equippementId_fkey` FOREIGN KEY (`equippementId`) REFERENCES `Equippement`(`equipid`) ON DELETE RESTRICT ON UPDATE CASCADE;
