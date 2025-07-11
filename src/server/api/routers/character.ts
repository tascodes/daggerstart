import { z } from "zod";
import { LevelChoice, ItemType } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { classes } from "~/lib/srd/classes";
import { Abilities } from "~/lib/srd/abilities";
import { type PrismaClient } from "@prisma/client";

async function calculateMaxHp(
  db: PrismaClient,
  characterId: string,
  className: string,
): Promise<number> {
  const classData = classes.find(
    (cls) => cls.name.toLowerCase() === className.toLowerCase(),
  );

  const baseHp = classData ? parseInt(classData.hp, 10) : 5;

  const hitPointChoices = await db.characterLevel.count({
    where: {
      characterId,
      choices: {
        some: {
          choice: LevelChoice.HIT_POINT_SLOT,
        },
      },
    },
  });

  return baseHp + hitPointChoices;
}

const createCharacterSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  pronouns: z.string().optional(),
  class: z.string().min(1, "Class is required"),
  subclass: z.string().min(1, "Subclass is required"),
  ancestry: z.string().min(1, "Ancestry is required"),
  community: z.string().min(1, "Community is required"),
  level: z
    .number()
    .min(1, "Level must be at least 1")
    .max(10, "Level must be at most 10"),
  experiences: z
    .array(z.string())
    .min(0)
    .max(5, "Maximum 5 experiences")
    .optional(),
});

const updateAbilitiesSchema = z.object({
  id: z.string(),
  agilityModifier: z.number().int().min(-10).max(10),
  strengthModifier: z.number().int().min(-10).max(10),
  finesseModifier: z.number().int().min(-10).max(10),
  instinctModifier: z.number().int().min(-10).max(10),
  presenceModifier: z.number().int().min(-10).max(10),
  knowledgeModifier: z.number().int().min(-10).max(10),
});

const updateHealthStatSchema = z.object({
  id: z.string(),
  field: z.enum(["hp", "stress", "hope", "armor"]),
  value: z.number().int().min(0).max(100),
});

const updateDefenseStatSchema = z.object({
  id: z.string(),
  field: z.enum(["evasion"]),
  value: z.number().int().min(0).max(50),
});

const updateGoldStatSchema = z.object({
  id: z.string(),
  field: z.enum(["goldHandfuls", "goldBags"]),
  value: z.number().int().min(0).max(10),
});

const updateGoldChestSchema = z.object({
  id: z.string(),
  hasChest: z.boolean(),
});

const updateExperienceBonusSchema = z.object({
  experienceId: z.string(),
  bonus: z.number().int().min(0).max(10),
});

const addInventoryItemSchema = z.object({
  characterId: z.string(),
  itemName: z.string(),
  itemType: z.nativeEnum(ItemType),
  quantity: z.number().int().min(1).max(999).default(1),
});

const updateInventoryItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(0).max(999),
});

const deleteInventoryItemSchema = z.object({
  id: z.string(),
});

const updateDamageThresholdSchema = z.object({
  id: z.string(),
  field: z.enum(["majorDamageThreshold", "severeDamageThreshold"]),
  value: z.string().optional(),
});

const updateCharacterSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  pronouns: z.string().optional(),
  class: z.string().min(1, "Class is required"),
  subclass: z.string().min(1, "Subclass is required"),
  ancestry: z.string().min(1, "Ancestry is required"),
  community: z.string().min(1, "Community is required"),
  level: z
    .number()
    .min(1, "Level must be at least 1")
    .max(10, "Level must be at most 10"),
  experiences: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        bonus: z.number().default(2),
      }),
    )
    .optional(),
});

const levelUpSchema = z.object({
  characterId: z.string(),
  targetLevel: z.number().optional(), // If specified, level up to this specific level
  choices: z.array(
    z.enum([
      "traits",
      "hitpoints",
      "stress",
      "experiences",
      "domain",
      "evasion",
    ]),
  ),
  newExperience: z.string().optional(),
});

const updateTraitMarkedSchema = z.object({
  id: z.string(),
  trait: z.enum([
    "agility",
    "strength",
    "finesse",
    "instinct",
    "presence",
    "knowledge",
  ]),
  marked: z.boolean(),
});

const selectCardSchema = z.object({
  characterId: z.string(),
  cardName: z.string(),
});

const deselectCardSchema = z.object({
  characterId: z.string(),
  cardName: z.string(),
});

// Helper function to calculate base slots by level
const calculateBaseSlotsByLevel = (
  characterLevel: number,
  levelHistory: Array<{
    level: number;
    choices: Array<{ choice: string }>;
  }>,
): Record<number, number> => {
  const baseSlots: Record<number, number> = {};

  // 2 cards at level 1
  baseSlots[1] = 2;

  // 1 card per level from 2 to characterLevel (default)
  for (let level = 2; level <= characterLevel; level++) {
    baseSlots[level] = 1;
  }

  // Check for domain card choices that modify slots
  levelHistory.forEach((levelData) => {
    const domainCardChoices = levelData.choices.filter(
      (choice) => choice.choice === "DOMAIN_CARD",
    );

    if (domainCardChoices.length > 0) {
      // Domain card choice gives 2 slots at that level (instead of the default 1)
      const choiceLevel = levelData.level;
      if (choiceLevel <= characterLevel && choiceLevel >= 2) {
        baseSlots[choiceLevel] = 2; // Replace the default 1 with 2
      }
    }
  });

  return baseSlots;
};

// Helper function to allocate slots optimally and check what cards can be selected
const calculateSlotAllocation = (
  characterLevel: number,
  levelHistory: Array<{
    level: number;
    choices: Array<{ choice: string }>;
  }>,
  selectedCards: Array<{ cardName: string }>,
  abilities: Array<{ name: string; level: string }>,
): {
  slotAllocation: Record<number, number>; // How many slots at each level are used
  canSelectLevel: Record<number, boolean>; // Which card levels can still be selected
} => {
  const baseSlots = calculateBaseSlotsByLevel(characterLevel, levelHistory);

  // Get all selected card levels
  const selectedCardLevels: number[] = [];
  selectedCards.forEach((selectedCard) => {
    const ability = abilities.find((a) => a.name === selectedCard.cardName);
    if (ability) {
      const selectedCardLevel = parseInt(ability.level);
      if (selectedCardLevel <= characterLevel) {
        selectedCardLevels.push(selectedCardLevel);
      }
    }
  });

  // Sort selected cards by level (lowest first) for optimal allocation
  selectedCardLevels.sort((a, b) => a - b);

  // Allocate slots optimally - use lowest available slot for each card
  const slotAllocation: Record<number, number> = {};
  for (let level = 1; level <= characterLevel; level++) {
    slotAllocation[level] = 0;
  }

  // For each selected card, allocate the lowest available slot that can accommodate it
  selectedCardLevels.forEach((cardLevel) => {
    let allocated = false;

    // Try to allocate from cardLevel upward
    for (
      let slotLevel = cardLevel;
      slotLevel <= characterLevel && !allocated;
      slotLevel++
    ) {
      const slotsAtLevel = baseSlots[slotLevel] ?? 0;
      const usedAtLevel = slotAllocation[slotLevel] ?? 0;

      if (usedAtLevel < slotsAtLevel) {
        slotAllocation[slotLevel] = (slotAllocation[slotLevel] ?? 0) + 1;
        allocated = true;
      }
    }
  });

  // Determine which card levels can still be selected
  const canSelectLevel: Record<number, boolean> = {};
  for (let cardLevel = 1; cardLevel <= characterLevel; cardLevel++) {
    let canSelect = false;

    // Check if there's any available slot from cardLevel upward
    for (let slotLevel = cardLevel; slotLevel <= characterLevel; slotLevel++) {
      const slotsAtLevel = baseSlots[slotLevel] ?? 0;
      const usedAtLevel = slotAllocation[slotLevel] ?? 0;

      if (usedAtLevel < slotsAtLevel) {
        canSelect = true;
        break;
      }
    }

    canSelectLevel[cardLevel] = canSelect;
  }

  return { slotAllocation, canSelectLevel };
};

// Helper function to check if a card of given level can be selected
const canSelectCardOfLevel = (
  cardLevel: number,
  characterLevel: number,
  levelHistory: Array<{
    level: number;
    choices: Array<{ choice: string }>;
  }>,
  selectedCards: Array<{ cardName: string }>,
  abilities: Array<{ name: string; level: string }>,
): boolean => {
  // Card level cannot be higher than character level
  if (cardLevel > characterLevel) {
    return false;
  }

  const { canSelectLevel } = calculateSlotAllocation(
    characterLevel,
    levelHistory,
    selectedCards,
    abilities,
  );

  return canSelectLevel[cardLevel] ?? false;
};

// Helper function to calculate slots available for each level (for display)
const calculateAvailableCardSlotsByLevel = (
  characterLevel: number,
  levelHistory: Array<{
    level: number;
    choices: Array<{ choice: string }>;
  }>,
  selectedCards: Array<{ cardName: string }>,
  abilities: Array<{ name: string; level: string }>,
): Record<number, number> => {
  const baseSlots = calculateBaseSlotsByLevel(characterLevel, levelHistory);

  // Calculate used slots by level
  const usedSlots: Record<number, number> = {};
  for (let level = 1; level <= characterLevel; level++) {
    usedSlots[level] = 0;
  }

  selectedCards.forEach((selectedCard) => {
    const ability = abilities.find((a) => a.name === selectedCard.cardName);
    if (ability) {
      const selectedCardLevel = parseInt(ability.level);
      if (selectedCardLevel <= characterLevel) {
        usedSlots[selectedCardLevel] = (usedSlots[selectedCardLevel] ?? 0) + 1;
      }
    }
  });

  // Calculate available slots for each level
  // For display: show how many slots are available that can be used for each card level
  const availableSlots: Record<number, number> = {};
  for (let cardLevel = 1; cardLevel <= characterLevel; cardLevel++) {
    let availableForThisLevel = 0;

    // Count available slots from this level and above that can be used for this card level
    for (let slotLevel = cardLevel; slotLevel <= characterLevel; slotLevel++) {
      const slotsAtLevel =
        (baseSlots[slotLevel] ?? 0) - (usedSlots[slotLevel] ?? 0);
      availableForThisLevel += Math.max(0, slotsAtLevel);
    }

    availableSlots[cardLevel] = availableForThisLevel;
  }

  return availableSlots;
};

// Helper function to get actual slots per level (for display)
const getActualSlotsByLevel = (
  characterLevel: number,
  levelHistory: Array<{
    level: number;
    choices: Array<{ choice: string }>;
  }>,
  selectedCards: Array<{ cardName: string }>,
  abilities: Array<{ name: string; level: string }>,
): Record<
  number,
  {
    total: number;
    used: number;
    available: number;
    canSelectThisLevel: boolean;
  }
> => {
  const baseSlots = calculateBaseSlotsByLevel(characterLevel, levelHistory);
  const { slotAllocation, canSelectLevel } = calculateSlotAllocation(
    characterLevel,
    levelHistory,
    selectedCards,
    abilities,
  );

  // Return actual slots per level with slot allocation information
  const actualSlots: Record<
    number,
    {
      total: number;
      used: number;
      available: number;
      canSelectThisLevel: boolean;
    }
  > = {};
  for (let level = 1; level <= characterLevel; level++) {
    const total = baseSlots[level] ?? 0;
    const used = slotAllocation[level] ?? 0;
    const available = Math.max(0, total - used);
    const canSelectThisLevel = canSelectLevel[level] ?? false;

    actualSlots[level] = { total, used, available, canSelectThisLevel };
  }

  return actualSlots;
};

export const characterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      // Validate experience count based on level
      const getExpectedExperienceCount = (level: number): number => {
        if (level === 1) return 2;
        if (level >= 2 && level <= 4) return 3;
        if (level >= 5 && level <= 7) return 4;
        if (level >= 8 && level <= 10) return 5;
        return 2;
      };

      const expectedCount = getExpectedExperienceCount(input.level);
      const actualCount = input.experiences?.length ?? 0;

      if (actualCount !== expectedCount) {
        throw new Error(
          `Character at level ${input.level} must have exactly ${expectedCount} experiences, but got ${actualCount}`,
        );
      }

      // Find the class data to get HP and evasion values
      const classData = classes.find(
        (cls) => cls.name.toLowerCase() === input.class.toLowerCase(),
      );

      // Parse HP and evasion from the class data (convert string to number)
      const baseHp = classData ? parseInt(classData.hp, 10) : 5;
      const evasion = classData ? parseInt(classData.evasion, 10) : 10;

      const character = await ctx.db.character.create({
        data: {
          name: input.name,
          pronouns: input.pronouns,
          class: input.class,
          subclass: input.subclass,
          ancestry: input.ancestry,
          community: input.community,
          level: input.level,
          maxHp: baseHp,
          evasion: evasion,
          // Ability modifiers default to 0 via schema
          user: { connect: { id: ctx.session.user.id } },
        },
      });

      // Create experiences if provided
      if (input.experiences && input.experiences.length > 0) {
        await ctx.db.experience.createMany({
          data: input.experiences.map((name) => ({
            name,
            characterId: character.id,
            bonus: 2,
          })),
        });
      }

      return character;
    }),

  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.character.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        experiences: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          game: {
            select: { id: true, name: true },
          },
          experiences: true,
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      // Allow viewing if user owns the character OR is in the same game
      const canView =
        character.userId === ctx.session.user.id ||
        (character.game &&
          (await ctx.db.game.findFirst({
            where: {
              id: character.game.id,
              OR: [
                { gameMasterId: ctx.session.user.id },
                { characters: { some: { userId: ctx.session.user.id } } },
              ],
            },
          })));

      if (!canView) {
        throw new Error("You don't have permission to view this character");
      }

      return character;
    }),

  updateAbilities: protectedProcedure
    .input(updateAbilitiesSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: {
          agilityModifier: input.agilityModifier,
          strengthModifier: input.strengthModifier,
          finesseModifier: input.finesseModifier,
          instinctModifier: input.instinctModifier,
          presenceModifier: input.presenceModifier,
          knowledgeModifier: input.knowledgeModifier,
        },
      });
    }),

  updateHealthStat: protectedProcedure
    .input(updateHealthStatSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: { [input.field]: input.value },
      });
    }),

  updateDefenseStat: protectedProcedure
    .input(updateDefenseStatSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: { [input.field]: input.value },
      });
    }),

  updateGoldStat: protectedProcedure
    .input(updateGoldStatSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: { [input.field]: input.value },
      });
    }),

  updateGoldChest: protectedProcedure
    .input(updateGoldChestSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: { goldChest: input.hasChest },
      });
    }),

  updateDamageThreshold: protectedProcedure
    .input(updateDamageThresholdSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: { [input.field]: input.value },
      });
    }),

  updateExperienceBonus: protectedProcedure
    .input(updateExperienceBonusSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the experience belongs to a character owned by the user
      const experience = await ctx.db.experience.findUnique({
        where: { id: input.experienceId },
        include: {
          character: {
            select: { userId: true },
          },
        },
      });

      if (!experience) {
        throw new Error("Experience not found");
      }

      if (experience.character.userId !== ctx.session.user.id) {
        throw new Error(
          "You can only update experiences for your own characters",
        );
      }

      return ctx.db.experience.update({
        where: { id: input.experienceId },
        data: { bonus: input.bonus },
      });
    }),

  update: protectedProcedure
    .input(updateCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user and get current level
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true, level: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      // If level is being reduced, delete CharacterLevel entries above the new level
      if (input.level < character.level) {
        await ctx.db.characterLevel.deleteMany({
          where: {
            characterId: input.id,
            level: {
              gt: input.level,
            },
          },
        });
      }

      // Find the class data to get HP and evasion values
      const classData = classes.find(
        (cls) => cls.name.toLowerCase() === input.class.toLowerCase(),
      );

      // Calculate max HP dynamically based on class and level choices
      const maxHp = await calculateMaxHp(ctx.db, input.id, input.class);
      const evasion = classData ? parseInt(classData.evasion, 10) : 10;

      // Handle experiences update if provided
      if (input.experiences) {
        // Get existing experiences
        const existingExperiences = await ctx.db.experience.findMany({
          where: { characterId: input.id },
        });

        // Delete experiences that are not in the new list
        const newExpIds = input.experiences
          .filter((exp) => exp.id)
          .map((exp) => exp.id!);
        const toDelete = existingExperiences.filter(
          (exp) => !newExpIds.includes(exp.id),
        );

        if (toDelete.length > 0) {
          await ctx.db.experience.deleteMany({
            where: {
              id: { in: toDelete.map((exp) => exp.id) },
            },
          });
        }

        // Update or create experiences
        for (const exp of input.experiences) {
          if (exp.id) {
            // Update existing
            await ctx.db.experience.update({
              where: { id: exp.id },
              data: { name: exp.name, bonus: exp.bonus },
            });
          } else {
            // Create new
            await ctx.db.experience.create({
              data: {
                name: exp.name,
                bonus: exp.bonus,
                characterId: input.id,
              },
            });
          }
        }
      }

      return ctx.db.character.update({
        where: { id: input.id },
        data: {
          name: input.name,
          pronouns: input.pronouns,
          class: input.class,
          subclass: input.subclass,
          ancestry: input.ancestry,
          community: input.community,
          level: input.level,
          maxHp: maxHp,
          evasion: evasion,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true, name: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only delete your own characters");
      }

      return ctx.db.character.delete({
        where: { id: input.id },
      });
    }),

  levelUp: protectedProcedure
    .input(levelUpSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true, level: true, class: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only level up your own characters");
      }

      // Validate choices (must be exactly 2)
      if (input.choices.length !== 2) {
        throw new Error("Must select exactly 2 level-up choices");
      }

      // Get existing character levels to find the next level that needs completion
      const characterLevels = await ctx.db.characterLevel.findMany({
        where: { characterId: input.characterId },
        select: { level: true },
        orderBy: { level: "asc" },
      });

      const existingLevels = characterLevels.map((cl) => cl.level);

      // Find the next level that needs to be completed
      let nextLevelToComplete = 2; // Start checking from level 2
      while (
        nextLevelToComplete <= character.level &&
        existingLevels.includes(nextLevelToComplete)
      ) {
        nextLevelToComplete++;
      }

      // If a specific target level is provided, ensure it's the next one that needs completion
      const actualTargetLevel = input.targetLevel
        ? input.targetLevel === nextLevelToComplete
          ? input.targetLevel
          : nextLevelToComplete
        : nextLevelToComplete;

      // Validate target level - actualTargetLevel should be within the character's current level
      if (actualTargetLevel > character.level) {
        throw new Error(
          `Cannot level up to ${actualTargetLevel}. Character's level is only ${character.level}. Please update character level first.`,
        );
      }

      // Check if new experience is required for this level
      const requiresNewExperience =
        actualTargetLevel === 2 ||
        actualTargetLevel === 5 ||
        actualTargetLevel === 8;
      if (requiresNewExperience && !input.newExperience?.trim()) {
        throw new Error(
          `A new experience is required when leveling up to level ${actualTargetLevel}`,
        );
      }

      // Check if character level already exists
      const existingLevel = await ctx.db.characterLevel.findUnique({
        where: {
          characterId_level: {
            characterId: input.characterId,
            level: actualTargetLevel,
          },
        },
      });

      if (existingLevel) {
        throw new Error("Character has already leveled up to this level");
      }

      // Map frontend choices to database enum values
      const choiceMap: Record<string, LevelChoice> = {
        traits: LevelChoice.TRAIT_BONUS,
        hitpoints: LevelChoice.HIT_POINT_SLOT,
        stress: LevelChoice.STRESS_SLOT,
        experiences: LevelChoice.EXPERIENCE_BONUS,
        domain: LevelChoice.DOMAIN_CARD,
        evasion: LevelChoice.EVASION_BONUS,
      };

      // Create the character level with choices
      const characterLevel = await ctx.db.characterLevel.create({
        data: {
          characterId: input.characterId,
          level: actualTargetLevel,
          choices: {
            create: input.choices.map((choice) => ({
              choice: choiceMap[choice]!,
            })),
          },
        },
        include: {
          choices: true,
        },
      });

      // Note: We don't update the character's level here since that's controlled by the create/edit page
      // The level up process only creates the CharacterLevel entries with choices

      // Check if hit points choice was selected and recalculate maxHp
      if (input.choices.includes("hitpoints")) {
        const newMaxHp = await calculateMaxHp(
          ctx.db,
          input.characterId,
          character.class,
        );
        // Update max HP if hit points were chosen
        await ctx.db.character.update({
          where: { id: input.characterId },
          data: { maxHp: newMaxHp },
        });
      }

      // Prepare trait update data only if leveling to 5 or 8
      if (actualTargetLevel === 5 || actualTargetLevel === 8) {
        await ctx.db.character.update({
          where: { id: input.characterId },
          data: {
            agilityMarked: false,
            strengthMarked: false,
            finesseMarked: false,
            instinctMarked: false,
            presenceMarked: false,
            knowledgeMarked: false,
          },
        });
      }

      // Create new experience if required
      if (requiresNewExperience && input.newExperience?.trim()) {
        await ctx.db.experience.create({
          data: {
            name: input.newExperience.trim(),
            bonus: 2,
            characterId: input.characterId,
          },
        });
      }

      return characterLevel;
    }),

  updateTraitMarked: protectedProcedure
    .input(updateTraitMarkedSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      // Map trait name to database field
      const traitFieldMap = {
        agility: "agilityMarked",
        strength: "strengthMarked",
        finesse: "finesseMarked",
        instinct: "instinctMarked",
        presence: "presenceMarked",
        knowledge: "knowledgeMarked",
      } as const;

      const fieldName = traitFieldMap[input.trait];

      return ctx.db.character.update({
        where: { id: input.id },
        data: { [fieldName]: input.marked },
      });
    }),

  recalculateMaxHp: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true, class: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only update your own characters");
      }

      const newMaxHp = await calculateMaxHp(ctx.db, input.id, character.class);

      return ctx.db.character.update({
        where: { id: input.id },
        data: { maxHp: newMaxHp },
      });
    }),

  getNextLevelToComplete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true, level: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only check your own characters");
      }

      // Get existing character levels
      const characterLevels = await ctx.db.characterLevel.findMany({
        where: { characterId: input.id },
        select: { level: true },
        orderBy: { level: "asc" },
      });

      const existingLevels = characterLevels.map((cl) => cl.level);
      const maxCompletedLevel =
        existingLevels.length > 0 ? Math.max(...existingLevels) : 1;

      // Find the next level that needs to be completed
      let nextLevelToComplete = 2; // Start checking from level 2
      while (
        nextLevelToComplete <= character.level &&
        existingLevels.includes(nextLevelToComplete)
      ) {
        nextLevelToComplete++;
      }

      return {
        currentLevel: character.level,
        maxCompletedLevel,
        nextLevelToComplete:
          nextLevelToComplete <= character.level ? nextLevelToComplete : null,
        hasIncompletelevels: nextLevelToComplete <= character.level,
      };
    }),

  getLevelHistory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        include: {
          CharacterLevel: {
            include: {
              choices: true,
              traitIncreases: true,
              experienceIncreases: true,
            },
            orderBy: { level: "asc" },
          },
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      // Allow viewing if user owns the character OR is in the same game
      const canView =
        character.userId === ctx.session.user.id ||
        (character.gameId &&
          (await ctx.db.game.findFirst({
            where: {
              id: character.gameId,
              OR: [
                { gameMasterId: ctx.session.user.id },
                { characters: { some: { userId: ctx.session.user.id } } },
              ],
            },
          })));

      if (!canView) {
        throw new Error("You don't have permission to view this character");
      }

      const experiences = await ctx.db.experience.findMany({
        where: { characterId: input.id },
        orderBy: { createdAt: "asc" },
      });

      return {
        characterClass: character.class,
        experiences: experiences,
        levels: character.CharacterLevel,
      };
    }),

  selectCard: protectedProcedure
    .input(selectCardSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        include: {
          CharacterLevel: {
            include: {
              choices: true,
            },
          },
          selectedCards: true,
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only select cards for your own characters");
      }

      // Check if card is already selected
      const existingSelection = await ctx.db.selectedCard.findUnique({
        where: {
          characterId_cardName: {
            characterId: input.characterId,
            cardName: input.cardName,
          },
        },
      });

      if (existingSelection) {
        throw new Error("Card is already selected");
      }

      // Find the ability to get its level
      const ability = Abilities.find((a) => a.name === input.cardName);
      if (!ability) {
        throw new Error("Invalid card name");
      }

      const cardLevel = parseInt(ability.level);

      // Check if we can select this card
      const canSelect = canSelectCardOfLevel(
        cardLevel,
        character.level,
        character.CharacterLevel,
        character.selectedCards,
        Abilities,
      );

      if (!canSelect) {
        if (cardLevel > character.level) {
          throw new Error(
            `Cannot select level ${cardLevel} card. Character is only level ${character.level}.`,
          );
        } else {
          const availableSlots = calculateAvailableCardSlotsByLevel(
            character.level,
            character.CharacterLevel,
            character.selectedCards,
            Abilities,
          );
          throw new Error(
            `No available slots for level ${cardLevel} cards. Available slots: Level 1: ${availableSlots[1] ?? 0}, Level 2: ${availableSlots[2] ?? 0}, etc.`,
          );
        }
      }

      return ctx.db.selectedCard.create({
        data: {
          characterId: input.characterId,
          cardName: input.cardName,
        },
      });
    }),

  deselectCard: protectedProcedure
    .input(deselectCardSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only deselect cards for your own characters");
      }

      const existingSelection = await ctx.db.selectedCard.findUnique({
        where: {
          characterId_cardName: {
            characterId: input.characterId,
            cardName: input.cardName,
          },
        },
      });

      if (!existingSelection) {
        throw new Error("Card is not selected");
      }

      return ctx.db.selectedCard.delete({
        where: {
          characterId_cardName: {
            characterId: input.characterId,
            cardName: input.cardName,
          },
        },
      });
    }),

  getSelectedCards: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        include: {
          selectedCards: true,
          CharacterLevel: {
            include: {
              choices: true,
            },
          },
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      // Allow viewing if user owns the character OR is in the same game
      const canView =
        character.userId === ctx.session.user.id ||
        (character.gameId &&
          (await ctx.db.game.findFirst({
            where: {
              id: character.gameId,
              OR: [
                { gameMasterId: ctx.session.user.id },
                { characters: { some: { userId: ctx.session.user.id } } },
              ],
            },
          })));

      if (!canView) {
        throw new Error("You don't have permission to view this character");
      }

      // Calculate available slots by level (for card selection validation)
      const availableSlotsByLevel = calculateAvailableCardSlotsByLevel(
        character.level,
        character.CharacterLevel,
        character.selectedCards,
        Abilities,
      );

      // Get actual slots per level (for display)
      const actualSlotsByLevel = getActualSlotsByLevel(
        character.level,
        character.CharacterLevel,
        character.selectedCards,
        Abilities,
      );

      // Calculate total slots
      const totalAvailableSlots = Object.values(actualSlotsByLevel).reduce(
        (sum, level) => sum + level.total,
        0,
      );
      const totalUsedSlots = character.selectedCards.length;

      return {
        selectedCards: character.selectedCards,
        availableSlots: totalAvailableSlots,
        usedSlots: totalUsedSlots,
        availableSlotsByLevel,
        actualSlotsByLevel,
      };
    }),

  // Inventory management
  getInventory: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        include: {
          inventoryItems: {
            orderBy: [{ itemType: "asc" }, { itemName: "asc" }],
          },
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      // Allow viewing if user owns the character OR is in the same game
      const canView =
        character.userId === ctx.session.user.id ||
        (character.gameId &&
          (await ctx.db.game.findFirst({
            where: {
              id: character.gameId,
              OR: [
                { gameMasterId: ctx.session.user.id },
                { characters: { some: { userId: ctx.session.user.id } } },
              ],
            },
          })));

      if (!canView) {
        throw new Error(
          "You don't have permission to view this character's inventory",
        );
      }

      return character.inventoryItems;
    }),

  addInventoryItem: protectedProcedure
    .input(addInventoryItemSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only add items to your own characters");
      }

      // Check if item already exists, if so, increase quantity
      const existingItem = await ctx.db.inventoryItem.findFirst({
        where: {
          characterId: input.characterId,
          itemName: input.itemName,
          itemType: input.itemType,
        },
      });

      if (existingItem) {
        return ctx.db.inventoryItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + input.quantity },
        });
      } else {
        return ctx.db.inventoryItem.create({
          data: {
            characterId: input.characterId,
            itemName: input.itemName,
            itemType: input.itemType,
            quantity: input.quantity,
          },
        });
      }
    }),

  updateInventoryItem: protectedProcedure
    .input(updateInventoryItemSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the inventory item belongs to a character owned by the user
      const inventoryItem = await ctx.db.inventoryItem.findUnique({
        where: { id: input.id },
        include: {
          character: {
            select: { userId: true },
          },
        },
      });

      if (!inventoryItem) {
        throw new Error("Inventory item not found");
      }

      if (inventoryItem.character.userId !== ctx.session.user.id) {
        throw new Error(
          "You can only update inventory items for your own characters",
        );
      }

      // If quantity is 0, delete the item
      if (input.quantity === 0) {
        return ctx.db.inventoryItem.delete({
          where: { id: input.id },
        });
      }

      return ctx.db.inventoryItem.update({
        where: { id: input.id },
        data: { quantity: input.quantity },
      });
    }),

  deleteInventoryItem: protectedProcedure
    .input(deleteInventoryItemSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify the inventory item belongs to a character owned by the user
      const inventoryItem = await ctx.db.inventoryItem.findUnique({
        where: { id: input.id },
        include: {
          character: {
            select: { userId: true },
          },
        },
      });

      if (!inventoryItem) {
        throw new Error("Inventory item not found");
      }

      if (inventoryItem.character.userId !== ctx.session.user.id) {
        throw new Error(
          "You can only delete inventory items for your own characters",
        );
      }

      return ctx.db.inventoryItem.delete({
        where: { id: input.id },
      });
    }),

  resetToLevel1: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.id },
        select: { userId: true, level: true, class: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only reset your own characters");
      }

      // Use a transaction to ensure all operations succeed or fail together
      return ctx.db.$transaction(async (tx) => {
        // 1. Delete all CharacterLevel entries
        await tx.characterLevel.deleteMany({
          where: { characterId: input.id },
        });

        // 2. Delete all SelectedCard entries (domain cards)
        await tx.selectedCard.deleteMany({
          where: { characterId: input.id },
        });

        // 3. Keep only the first 2 experiences
        const experiences = await tx.experience.findMany({
          where: { characterId: input.id },
          orderBy: { createdAt: "asc" },
        });

        if (experiences.length > 2) {
          const experiencesToDelete = experiences.slice(2);
          await tx.experience.deleteMany({
            where: {
              id: {
                in: experiencesToDelete.map((exp) => exp.id),
              },
            },
          });
        }

        // 4. Reset character level to 1 and recalculate maxHp
        const classData = classes.find(
          (cls) => cls.name.toLowerCase() === character.class?.toLowerCase(),
        );
        const baseHp = classData ? parseInt(classData.hp, 10) : 5;

        return tx.character.update({
          where: { id: input.id },
          data: {
            level: 1,
            maxHp: baseHp, // Reset to base class HP
          },
        });
      });
    }),
});
