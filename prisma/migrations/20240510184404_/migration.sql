/*
  Warnings:

  - You are about to alter the column `status` on the `demandexpertise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.
  - A unique constraint covering the columns `[rapportId]` on the table `DemandExpertise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `demandexpertise` ADD COLUMN `rapportId` INTEGER NULL,
    MODIFY `status` ENUM('EN_ATTENTE', 'ACCEPTE', 'REJETE', 'TERMINE') NOT NULL DEFAULT 'EN_ATTENTE';

-- CreateTable
CREATE TABLE `Rapport` (
    `idr` INTEGER NOT NULL AUTO_INCREMENT,
    `expertiseId` INTEGER NOT NULL,
    `date_expertise` VARCHAR(191) NOT NULL,
    `adresse_expertise` VARCHAR(191) NOT NULL,
    `lieu_expertise` VARCHAR(191) NOT NULL,
    `expert` VARCHAR(191) NOT NULL,
    `email_expert` VARCHAR(191) NOT NULL,
    `tele_expert` VARCHAR(191) NOT NULL,
    `nom_client` VARCHAR(191) NOT NULL,
    `adresse_client` VARCHAR(191) NOT NULL,
    `tel_client` VARCHAR(191) NOT NULL,
    `email_client` VARCHAR(191) NOT NULL,
    `marque_v` VARCHAR(191) NOT NULL,
    `modele_v` VARCHAR(191) NOT NULL,
    `motirisation_v` VARCHAR(191) NOT NULL,
    `couleur_v` VARCHAR(191) NOT NULL,
    `transmission_v` VARCHAR(191) NOT NULL,
    `km_v` INTEGER NOT NULL,
    `his_prio` INTEGER NOT NULL,
    `immatriculation_v` VARCHAR(191) NOT NULL,
    `carrosserie` VARCHAR(191) NOT NULL,
    `type_carburent` VARCHAR(191) NOT NULL,
    `puissance` VARCHAR(191) NOT NULL,
    `nb_place` INTEGER NOT NULL,
    `nb_porte` INTEGER NOT NULL,
    `commentaire_exp` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Rapport_expertiseId_key`(`expertiseId`),
    PRIMARY KEY (`idr`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `DemandExpertise_rapportId_key` ON `DemandExpertise`(`rapportId`);

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_expertiseId_fkey` FOREIGN KEY (`expertiseId`) REFERENCES `DemandExpertise`(`idde`) ON DELETE RESTRICT ON UPDATE CASCADE;
