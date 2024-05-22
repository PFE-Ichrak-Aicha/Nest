/*
  Warnings:

  - You are about to drop the column `adresse` on the `creationcompterequest` table. All the data in the column will be lost.
  - You are about to drop the column `codePostal` on the `creationcompterequest` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `creationcompterequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `creationcompterequest` DROP COLUMN `adresse`,
    DROP COLUMN `codePostal`,
    DROP COLUMN `ville`;
