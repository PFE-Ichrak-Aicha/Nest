/*
  Warnings:

  - You are about to drop the column `isApproved` on the `expertrequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[expertId]` on the table `ExpertRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `ExpertRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expertId` to the `ExpertRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expertIde` to the `ExpertRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expertrequest` DROP COLUMN `isApproved`,
    ADD COLUMN `adminId` INTEGER NOT NULL,
    ADD COLUMN `expertId` INTEGER NOT NULL,
    ADD COLUMN `expertIde` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'en attente';

-- CreateIndex
CREATE UNIQUE INDEX `ExpertRequest_expertId_key` ON `ExpertRequest`(`expertId`);

-- AddForeignKey
ALTER TABLE `ExpertRequest` ADD CONSTRAINT `ExpertRequest_expertId_fkey` FOREIGN KEY (`expertId`) REFERENCES `Expert`(`ide`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExpertRequest` ADD CONSTRAINT `ExpertRequest_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`ida`) ON DELETE RESTRICT ON UPDATE CASCADE;
