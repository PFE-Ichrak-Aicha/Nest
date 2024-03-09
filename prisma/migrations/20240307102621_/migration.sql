/*
  Warnings:

  - You are about to drop the column `MotDePasseConfirmation` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `MotDePasseConfirmation`,
    ADD COLUMN `resetCode` VARCHAR(191) NULL;
