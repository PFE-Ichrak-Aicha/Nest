/*
  Warnings:

  - A unique constraint covering the columns `[publicationId,equippementId]` on the table `EquippementPublication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `_EquippementToPublication` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EquippementToPublication_AB_unique`(`A`, `B`),
    INDEX `_EquippementToPublication_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `EquippementPublication_publicationId_equippementId_key` ON `EquippementPublication`(`publicationId`, `equippementId`);

-- AddForeignKey
ALTER TABLE `_EquippementToPublication` ADD CONSTRAINT `_EquippementToPublication_A_fkey` FOREIGN KEY (`A`) REFERENCES `Equippement`(`equipid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EquippementToPublication` ADD CONSTRAINT `_EquippementToPublication_B_fkey` FOREIGN KEY (`B`) REFERENCES `Publication`(`pubid`) ON DELETE CASCADE ON UPDATE CASCADE;
