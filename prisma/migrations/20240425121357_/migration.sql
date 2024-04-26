/*
  Warnings:

  - Added the required column `equippement` to the `Publication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `publication` ADD COLUMN `equippement` ENUM('ToitOuvrant', 'Attelage', 'Climatisation', 'Gps', 'CameraDeRecul', 'RadarDeRecul', 'Bluetooth', 'ToitPanoramique', 'Regulateur', 'Carplay', 'Palette', 'GripControl') NOT NULL;
