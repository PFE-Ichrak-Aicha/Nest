-- CreateTable
CREATE TABLE `Media` (
    `mediaID` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `images` VARCHAR(191) NOT NULL,
    `videos` VARCHAR(191) NOT NULL,
    `pubId` INTEGER NOT NULL,

    PRIMARY KEY (`mediaID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_pubId_fkey` FOREIGN KEY (`pubId`) REFERENCES `Publication`(`pubid`) ON DELETE CASCADE ON UPDATE CASCADE;
