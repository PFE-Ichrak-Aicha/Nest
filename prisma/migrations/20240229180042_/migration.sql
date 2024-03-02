/*
  Warnings:

  - You are about to drop the column `filePath` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `mediaType` on the `media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `media` DROP COLUMN `filePath`,
    DROP COLUMN `fileType`,
    DROP COLUMN `mediaType`;
