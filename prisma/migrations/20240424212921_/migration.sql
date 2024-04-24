-- DropIndex
DROP INDEX `PublicationFavorite_publicationId_fkey` ON `publicationfavorite`;

-- CreateTable
CREATE TABLE `Publication` (
    `pubid` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `marque` VARCHAR(20) NOT NULL,
    `model` VARCHAR(30) NOT NULL,
    `anneeFabrication` INTEGER NOT NULL,
    `nombrePlace` INTEGER NOT NULL,
    `couleur` VARCHAR(30) NOT NULL,
    `kilometrage` INTEGER NOT NULL,
    `prix` DOUBLE NOT NULL,
    `descrption` VARCHAR(400) NULL,
    `typeCarburant` ENUM('Essence', 'Diesel', 'GPL', 'GNL', 'Electrique', 'Ethanol') NOT NULL,
    `userId` INTEGER NOT NULL,
    `videoId` INTEGER NULL,
    `city` ENUM('TUNIS', 'ARIANA', 'BEN_AROUS', 'BIZERTE', 'GABES', 'GAFSA', 'JENDOUBA', 'KAIROUAN', 'KASERINE', 'KEBILI', 'LEKEIL', 'MAHDIA', 'MANOUBA', 'MEDENINE', 'MONASTIR', 'NASRALLAH', 'NABEUL', 'SFAX', 'SIDI_BOUZID', 'SILIANA', 'SOUSSE', 'TATAOUINE', 'TOZEUR', 'ZAGHOUAN') NOT NULL,
    `boiteVitesse` ENUM('Manuelle', 'Automatique') NOT NULL,
    `transmission` VARCHAR(191) NOT NULL,
    `carrassorie` VARCHAR(191) NOT NULL,
    `sellerie` ENUM('Alcantara', 'Cuir', 'Similcuir', 'Tisuu', 'Plastique', 'Velours') NOT NULL,

    UNIQUE INDEX `Publication_videoId_key`(`videoId`),
    PRIMARY KEY (`pubid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `publicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Publication` ADD CONSTRAINT `Publication_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Publication` ADD CONSTRAINT `Publication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`pubid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublicationFavorite` ADD CONSTRAINT `PublicationFavorite_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publication`(`pubid`) ON DELETE RESTRICT ON UPDATE CASCADE;
