/*
  Warnings:

  - Added the required column `commentaire` to the `CreationCompteRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `creationcompterequest` ADD COLUMN `commentaire` VARCHAR(191) NOT NULL;
