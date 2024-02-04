-- CreateTable
CREATE TABLE `Publication` (
    `pubid` INTEGER NOT NULL AUTO_INCREMENT,
    `marque` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `anneeFabrication` INTEGER NOT NULL,
    `nombrePlace` INTEGER NOT NULL,
    `couleur` VARCHAR(191) NOT NULL,
    `kilometrage` INTEGER NOT NULL,
    `prix` DOUBLE NOT NULL,
    `descrption` VARCHAR(191) NULL,
    `typeCarburant` ENUM('Essence', 'Diesel', 'GPL', 'Electrique') NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`pubid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Publication` ADD CONSTRAINT `Publication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
