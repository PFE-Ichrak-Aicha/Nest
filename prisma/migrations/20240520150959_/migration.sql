-- CreateTable
CREATE TABLE `CreationCompteRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `motDePasse` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NOT NULL,
    `codePostal` VARCHAR(191) NOT NULL,
    `photoProfil` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'en attente',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `adminId` INTEGER NULL,

    UNIQUE INDEX `CreationCompteRequest_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CreationCompteRequest` ADD CONSTRAINT `CreationCompteRequest_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`ida`) ON DELETE SET NULL ON UPDATE CASCADE;
