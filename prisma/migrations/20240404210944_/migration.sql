-- CreateTable
CREATE TABLE `Admin` (
    `ida` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(80) NOT NULL,
    `MotDePasse` VARCHAR(80) NOT NULL,
    `PhotoProfil` VARCHAR(191) NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`ida`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
