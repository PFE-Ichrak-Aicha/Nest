/*
  Warnings:

  - A unique constraint covering the columns `[expertId,userId,pubId]` on the table `DemandExpertise` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DemandExpertise_expertId_userId_pubId_key` ON `DemandExpertise`(`expertId`, `userId`, `pubId`);
