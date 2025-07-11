-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    INDEX `Post_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,
    `refresh_token_expires_in` INTEGER NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `pronouns` VARCHAR(191) NULL,
    `class` VARCHAR(191) NOT NULL,
    `subclass` VARCHAR(191) NOT NULL,
    `ancestry` VARCHAR(191) NOT NULL,
    `community` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `agilityModifier` INTEGER NOT NULL DEFAULT 0,
    `strengthModifier` INTEGER NOT NULL DEFAULT 0,
    `finesseModifier` INTEGER NOT NULL DEFAULT 0,
    `instinctModifier` INTEGER NOT NULL DEFAULT 0,
    `presenceModifier` INTEGER NOT NULL DEFAULT 0,
    `knowledgeModifier` INTEGER NOT NULL DEFAULT 0,
    `agilityMarked` BOOLEAN NOT NULL DEFAULT false,
    `strengthMarked` BOOLEAN NOT NULL DEFAULT false,
    `finesseMarked` BOOLEAN NOT NULL DEFAULT false,
    `instinctMarked` BOOLEAN NOT NULL DEFAULT false,
    `presenceMarked` BOOLEAN NOT NULL DEFAULT false,
    `knowledgeMarked` BOOLEAN NOT NULL DEFAULT false,
    `hp` INTEGER NOT NULL DEFAULT 0,
    `maxHp` INTEGER NOT NULL DEFAULT 0,
    `stress` INTEGER NOT NULL DEFAULT 0,
    `hope` INTEGER NOT NULL DEFAULT 0,
    `majorDamageThreshold` VARCHAR(191) NULL,
    `severeDamageThreshold` VARCHAR(191) NULL,
    `evasion` INTEGER NOT NULL DEFAULT 0,
    `armor` INTEGER NOT NULL DEFAULT 0,
    `goldHandfuls` INTEGER NOT NULL DEFAULT 0,
    `goldBags` INTEGER NOT NULL DEFAULT 0,
    `goldChest` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `gameId` VARCHAR(191) NULL,

    INDEX `Character_userId_idx`(`userId`),
    INDEX `Character_gameId_idx`(`gameId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gameMasterId` VARCHAR(191) NOT NULL,

    INDEX `Game_gameMasterId_idx`(`gameMasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiceRoll` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `rollType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diceExpression` VARCHAR(191) NOT NULL,
    `individualResults` JSON NOT NULL,
    `total` INTEGER NOT NULL,
    `modifier` INTEGER NULL,
    `finalTotal` INTEGER NULL,
    `hopeResult` INTEGER NULL,
    `fearResult` INTEGER NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `characterId` VARCHAR(191) NULL,

    INDEX `DiceRoll_gameId_idx`(`gameId`),
    INDEX `DiceRoll_userId_idx`(`userId`),
    INDEX `DiceRoll_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameMasterFear` (
    `id` VARCHAR(191) NOT NULL,
    `fearCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gameId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    INDEX `GameMasterFear_gameId_idx`(`gameId`),
    INDEX `GameMasterFear_userId_idx`(`userId`),
    UNIQUE INDEX `GameMasterFear_gameId_userId_key`(`gameId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterLevel` (
    `id` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `multiclass` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,

    INDEX `CharacterLevel_characterId_idx`(`characterId`),
    INDEX `CharacterLevel_level_idx`(`level`),
    INDEX `CharacterLevel_characterId_level_idx`(`characterId`, `level`),
    UNIQUE INDEX `CharacterLevel_characterId_level_key`(`characterId`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterLevelChoice` (
    `id` VARCHAR(191) NOT NULL,
    `characterLevelId` VARCHAR(191) NOT NULL,
    `choice` ENUM('TRAIT_BONUS', 'HIT_POINT_SLOT', 'STRESS_SLOT', 'EXPERIENCE_BONUS', 'DOMAIN_CARD', 'EVASION_BONUS', 'SUBCLASS_CARD', 'PROFICIENCY', 'MULTICLASS') NOT NULL,

    INDEX `CharacterLevelChoice_characterLevelId_idx`(`characterLevelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterLevelTraitIncrease` (
    `id` VARCHAR(191) NOT NULL,
    `characterLevelId` VARCHAR(191) NOT NULL,
    `trait` ENUM('AGILITY', 'STRENGTH', 'FINESSE', 'INSTINCT', 'PRESENCE', 'KNOWLEDGE') NOT NULL,

    INDEX `CharacterLevelTraitIncrease_characterLevelId_idx`(`characterLevelId`),
    INDEX `CharacterLevelTraitIncrease_trait_idx`(`trait`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CharacterLevelExperienceIncrease` (
    `id` VARCHAR(191) NOT NULL,
    `characterLevelId` VARCHAR(191) NOT NULL,
    `experience` VARCHAR(191) NOT NULL,

    INDEX `CharacterLevelExperienceIncrease_characterLevelId_idx`(`characterLevelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelectedCard` (
    `id` VARCHAR(191) NOT NULL,
    `cardName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,

    INDEX `SelectedCard_characterId_idx`(`characterId`),
    UNIQUE INDEX `SelectedCard_characterId_cardName_key`(`characterId`, `cardName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Experience` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `bonus` INTEGER NOT NULL DEFAULT 2,
    `level` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,

    INDEX `Experience_characterId_idx`(`characterId`),
    INDEX `Experience_level_idx`(`level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `id` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `itemType` ENUM('ITEM', 'ARMOR', 'WEAPON', 'CONSUMABLE') NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `characterId` VARCHAR(191) NOT NULL,

    INDEX `InventoryItem_characterId_idx`(`characterId`),
    INDEX `InventoryItem_itemType_idx`(`itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_gameMasterId_fkey` FOREIGN KEY (`gameMasterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiceRoll` ADD CONSTRAINT `DiceRoll_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiceRoll` ADD CONSTRAINT `DiceRoll_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiceRoll` ADD CONSTRAINT `DiceRoll_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameMasterFear` ADD CONSTRAINT `GameMasterFear_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameMasterFear` ADD CONSTRAINT `GameMasterFear_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterLevel` ADD CONSTRAINT `CharacterLevel_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterLevelChoice` ADD CONSTRAINT `CharacterLevelChoice_characterLevelId_fkey` FOREIGN KEY (`characterLevelId`) REFERENCES `CharacterLevel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterLevelTraitIncrease` ADD CONSTRAINT `CharacterLevelTraitIncrease_characterLevelId_fkey` FOREIGN KEY (`characterLevelId`) REFERENCES `CharacterLevel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CharacterLevelExperienceIncrease` ADD CONSTRAINT `CharacterLevelExperienceIncrease_characterLevelId_fkey` FOREIGN KEY (`characterLevelId`) REFERENCES `CharacterLevel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelectedCard` ADD CONSTRAINT `SelectedCard_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
