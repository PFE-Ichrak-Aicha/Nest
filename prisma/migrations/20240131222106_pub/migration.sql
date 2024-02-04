/*
  Warnings:

  - You are about to alter the column `marque` on the `publication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `model` on the `publication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `couleur` on the `publication` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE `publication` MODIFY `marque` VARCHAR(20) NOT NULL,
    MODIFY `model` VARCHAR(30) NOT NULL,
    MODIFY `couleur` VARCHAR(30) NOT NULL,
    MODIFY `descrption` VARCHAR(400) NULL;
