/*
  Warnings:

  - You are about to drop the column `equippementId` on the `equippementpublication` table. All the data in the column will be lost.
  - The values [LEKEIL,NASRALLAH] on the enum `Expert_city` will be removed. If these variants are still used in the database, this will fail.
  - The values [LEKEIL,NASRALLAH] on the enum `Expert_city` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[publicationId,equippid]` on the table `EquippementPublication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `equippid` to the `EquippementPublication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey


-- DropIndex


-- AlterTable


-- AlterTable
ALTER TABLE `expert` MODIFY `city` ENUM('TUNIS', 'Tunis', 'tunis', 'ARIANA', 'Ariana', 'ariana', 'Ben_Arous', 'ben_arous', 'BEN_AROUS', 'ben_Arous', 'Bizerte', 'bizerte', 'BIZERTE', 'Gabes', 'gabes', 'GABES', 'Gafsa', 'gafsa', 'GAFSA', 'Jendouba', 'jendouba', 'JENDOUBA', 'Kairouan', 'kairouan', 'KAIROUAN', 'Kasserine', 'KASERINE', 'kasserine', 'kebili', 'Kebili', 'KEBILI', 'Mahdia', 'mahdia', 'MAHDIA', 'Manouba', 'manouba', 'MANOUBA', 'Medenine', 'medenine', 'MEDENINE', 'Monastir', 'monastir', 'MONASTIR', 'NABEUL', 'Nabeul', 'nabeul', 'Sfax', 'sfax', 'SFAX', 'Sidi_Bouzid', 'sidi_Bouzid', 'sidi_bouzid', 'SIDI_BOUZID', 'Siliana', 'siliana', 'SILIANA', 'SOUSSE', 'Sousse', 'sousse', 'Tataouine', 'tataouine', 'TATAOUINE', 'TOZEUR', 'Tozeur', 'tozeur', 'Zaghouan', 'zaghoun', 'ZAGHOUAN', 'BEJA', 'Beja', 'beja', 'Kef', 'kef', 'KEF') NOT NULL DEFAULT 'TUNIS';

-- AlterTable
ALTER TABLE `publication` MODIFY `typeCarburant` ENUM('Essence', 'Diesel', 'GPL', 'Gpl', 'Gnl', 'GNL', 'Electrique', 'Ethanol') NOT NULL,
    MODIFY `city` ENUM('TUNIS', 'Tunis', 'tunis', 'ARIANA', 'Ariana', 'ariana', 'Ben_Arous', 'ben_arous', 'BEN_AROUS', 'ben_Arous', 'Bizerte', 'bizerte', 'BIZERTE', 'Gabes', 'gabes', 'GABES', 'Gafsa', 'gafsa', 'GAFSA', 'Jendouba', 'jendouba', 'JENDOUBA', 'Kairouan', 'kairouan', 'KAIROUAN', 'Kasserine', 'KASERINE', 'kasserine', 'kebili', 'Kebili', 'KEBILI', 'Mahdia', 'mahdia', 'MAHDIA', 'Manouba', 'manouba', 'MANOUBA', 'Medenine', 'medenine', 'MEDENINE', 'Monastir', 'monastir', 'MONASTIR', 'NABEUL', 'Nabeul', 'nabeul', 'Sfax', 'sfax', 'SFAX', 'Sidi_Bouzid', 'sidi_Bouzid', 'sidi_bouzid', 'SIDI_BOUZID', 'Siliana', 'siliana', 'SILIANA', 'SOUSSE', 'Sousse', 'sousse', 'Tataouine', 'tataouine', 'TATAOUINE', 'TOZEUR', 'Tozeur', 'tozeur', 'Zaghouan', 'zaghoun', 'ZAGHOUAN', 'BEJA', 'Beja', 'beja', 'Kef', 'kef', 'KEF') NOT NULL;

-- CreateIndex


-- AddForeignKey

