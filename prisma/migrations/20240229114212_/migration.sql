/*
  Warnings:

  - Added the required column `filePath` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `media` ADD COLUMN `filePath` VARCHAR(191) NOT NULL,
    ADD COLUMN `fileType` VARCHAR(191) NOT NULL;
