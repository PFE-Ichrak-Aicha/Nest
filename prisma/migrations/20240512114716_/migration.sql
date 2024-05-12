/*
  Warnings:

  - Added the required column `cout` to the `Expert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Expert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expert` ADD COLUMN `cout` INTEGER NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL;
