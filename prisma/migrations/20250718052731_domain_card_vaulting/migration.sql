-- AlterTable
ALTER TABLE `SelectedCard` ADD COLUMN `inLoadout` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `tokens` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `SelectedCard_characterId_inLoadout_idx` ON `SelectedCard`(`characterId`, `inLoadout`);
