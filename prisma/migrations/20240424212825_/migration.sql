/*
  Warnings:

  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `publication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_publicationId_fkey`;

-- DropForeignKey
ALTER TABLE `publication` DROP FOREIGN KEY `Publication_userId_fkey`;

-- DropForeignKey
ALTER TABLE `publication` DROP FOREIGN KEY `Publication_videoId_fkey`;

-- DropForeignKey
ALTER TABLE `publicationfavorite` DROP FOREIGN KEY `PublicationFavorite_publicationId_fkey`;

-- DropTable
DROP TABLE `image`;

-- DropTable
DROP TABLE `publication`;

-- DropTable
DROP TABLE `video`;
