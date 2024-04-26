/*
  Warnings:

  - You are about to drop the column `equippementId` on the `equippementpublication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicationId,equippid]` on the table `EquippementPublication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `equippid` to the `EquippementPublication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `equippementpublication` DROP FOREIGN KEY `EquippementPublication_equippementId_fkey`;

-- DropIndex
DROP INDEX `EquippementPublication_publicationId_equippementId_key` ON `equippementpublication`;

-- AlterTable
ALTER TABLE `equippementpublication` DROP COLUMN `equippementId`,
    ADD COLUMN `equippid` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EquippementPublication_publicationId_equippid_key` ON `EquippementPublication`(`publicationId`, `equippid`);

-- AddForeignKey
ALTER TABLE `EquippementPublication` ADD CONSTRAINT `EquippementPublication_equippid_fkey` FOREIGN KEY (`equippid`) REFERENCES `Equippement`(`equipid`) ON DELETE RESTRICT ON UPDATE CASCADE;
