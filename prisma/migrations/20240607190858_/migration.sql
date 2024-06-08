-- AlterTable
ALTER TABLE `expert` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;
