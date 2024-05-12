/*
  Warnings:

  - Added the required column `cout` to the `ExpertRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ExpertRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expertrequest` ADD COLUMN `cout` INTEGER NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL;
