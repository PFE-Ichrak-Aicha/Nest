/*
  Warnings:

  - A unique constraint covering the columns `[expertiseId]` on the table `Expert` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expertiseId` to the `Expert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expert` ADD COLUMN `expertiseId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `DemandExpertise` (
    `idde` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'en attente',
    `userId` INTEGER NOT NULL,
    `pubId` INTEGER NOT NULL,
    `expertId` INTEGER NOT NULL,

    UNIQUE INDEX `DemandExpertise_expertId_key`(`expertId`),
    PRIMARY KEY (`idde`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Expert_expertiseId_key` ON `Expert`(`expertiseId`);

-- AddForeignKey
ALTER TABLE `DemandExpertise` ADD CONSTRAINT `DemandExpertise_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandExpertise` ADD CONSTRAINT `DemandExpertise_pubId_fkey` FOREIGN KEY (`pubId`) REFERENCES `Publication`(`pubid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandExpertise` ADD CONSTRAINT `DemandExpertise_expertId_fkey` FOREIGN KEY (`expertId`) REFERENCES `Expert`(`ide`) ON DELETE RESTRICT ON UPDATE CASCADE;
