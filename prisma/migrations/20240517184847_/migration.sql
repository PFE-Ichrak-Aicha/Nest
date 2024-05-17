/*
  Warnings:

  - You are about to drop the column `expert` on the `rapport` table. All the data in the column will be lost.
  - Added the required column `expertId` to the `Rapport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expert_nom` to the `Rapport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rapport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rapport` DROP COLUMN `expert`,
    ADD COLUMN `expertId` INTEGER NOT NULL,
    ADD COLUMN `expert_nom` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_expertId_fkey` FOREIGN KEY (`expertId`) REFERENCES `Expert`(`ide`) ON DELETE RESTRICT ON UPDATE CASCADE;
