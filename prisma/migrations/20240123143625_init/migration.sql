-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `MotDePasse` VARCHAR(80) NOT NULL,
    `Nom` VARCHAR(80) NOT NULL,
    `Prenom` VARCHAR(80) NOT NULL,
    `NumTel` INTEGER NOT NULL,
    `Adresse` VARCHAR(191) NOT NULL,
    `Ville` VARCHAR(191) NOT NULL,
    `CodePostal` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
