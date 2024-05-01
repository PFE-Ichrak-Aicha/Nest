/*
  Warnings:

  - Added the required column `city` to the `ExpertRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expertrequest` ADD COLUMN `city` ENUM('TUNIS', 'Tunis', 'tunis', 'ARIANA', 'Ariana', 'ariana', 'Ben_Arous', 'ben_arous', 'BEN_AROUS', 'ben_Arous', 'Bizerte', 'bizerte', 'BIZERTE', 'Gabes', 'gabes', 'GABES', 'Gafsa', 'gafsa', 'GAFSA', 'Jendouba', 'jendouba', 'JENDOUBA', 'Kairouan', 'kairouan', 'KAIROUAN', 'Kasserine', 'KASERINE', 'kasserine', 'kebili', 'Kebili', 'KEBILI', 'Mahdia', 'mahdia', 'MAHDIA', 'Manouba', 'manouba', 'MANOUBA', 'Medenine', 'medenine', 'MEDENINE', 'Monastir', 'monastir', 'MONASTIR', 'NABEUL', 'Nabeul', 'nabeul', 'Sfax', 'sfax', 'SFAX', 'Sidi_Bouzid', 'sidi_Bouzid', 'sidi_bouzid', 'SIDI_BOUZID', 'Siliana', 'siliana', 'SILIANA', 'SOUSSE', 'Sousse', 'sousse', 'Tataouine', 'tataouine', 'TATAOUINE', 'TOZEUR', 'Tozeur', 'tozeur', 'Zaghouan', 'zaghoun', 'ZAGHOUAN', 'BEJA', 'Beja', 'beja', 'Kef', 'kef', 'KEF') NOT NULL;
