/*
  Warnings:

  - The values [Tisuu] on the enum `Publication_sellerie` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `publication` MODIFY `sellerie` ENUM('Alcantara', 'Cuir', 'Similcuir', 'Tissu', 'Plastique', 'Velours') NOT NULL;
