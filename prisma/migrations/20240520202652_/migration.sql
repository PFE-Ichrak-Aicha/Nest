/*
  Warnings:

  - Made the column `adminId` on table `creationcompterequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `creationcompterequest` DROP FOREIGN KEY `CreationCompteRequest_adminId_fkey`;

-- AlterTable
ALTER TABLE `creationcompterequest` MODIFY `adminId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CreationCompteRequest` ADD CONSTRAINT `CreationCompteRequest_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`ida`) ON DELETE RESTRICT ON UPDATE CASCADE;
