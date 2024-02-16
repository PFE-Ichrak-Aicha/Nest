/*
  Warnings:

  - Added the required column `MotDePasseConfirmation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `MotDePasseConfirmation` VARCHAR(80) NOT NULL;
