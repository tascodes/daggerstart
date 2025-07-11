import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  observable,
} from "~/server/api/trpc";
import {
  gameEmitter,
  type DiceRollEventData,
  type FearUpdateEventData,
} from "~/server/api/events";
import { getDiceRollOutcome } from "~/utils/dice";

// Define types for dice roll results since rpg-dice-roller doesn't have proper TypeScript types
interface DiceRollResult {
  total: number;
  rolls: DiceRollGroup[];
  output: string;
}

interface DiceRollGroup {
  rolls?: IndividualRoll[];
  value?: number;
}

interface IndividualRoll {
  value: number;
}

const createGameSchema = z.object({
  name: z
    .string()
    .min(1, "Campaign name is required")
    .max(100, "Campaign name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

const rollActionDiceSchema = z.object({
  gameId: z.string(),
  name: z.string().min(1, "Roll name is required"),
  characterId: z.string().optional(),
  modifier: z.number().int().optional(),
});

const rollDamageSchema = z.object({
  gameId: z.string(),
  name: z.string().min(1, "Roll name is required"),
  diceType: z.enum(["d4", "d6", "d8", "d10", "d12", "d20"]),
  quantity: z.number().min(1).max(20),
  characterId: z.string().optional(),
});

const rollCustomDiceSchema = z.object({
  gameId: z.string(),
  name: z.string().min(1, "Roll name is required"),
  diceExpression: z.string().min(1, "Dice expression is required"),
  characterId: z.string().optional(),
});

export const gameRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createGameSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.game.create({
        data: {
          name: input.name,
          description: input.description,
          gameMaster: { connect: { id: ctx.session.user.id } },
        },
        include: {
          gameMaster: {
            select: { id: true, name: true, image: true },
          },
          characters: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          _count: {
            select: { characters: true },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is the game master
      const game = await ctx.db.game.findUnique({
        where: { id: input.id },
        select: { gameMasterId: true },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.gameMasterId !== ctx.session.user.id) {
        throw new Error("Only the game master can delete this game");
      }

      return ctx.db.game.delete({
        where: { id: input.id },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.game.findUnique({
        where: { id: input.id },
        include: {
          gameMaster: {
            select: { id: true, name: true, image: true },
          },
          characters: {
            include: {
              user: {
                select: { id: true, name: true, image: true },
              },
            },
          },
          _count: {
            select: { characters: true },
          },
        },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      return game;
    }),

  getUserGames: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.game.findMany({
      where: {
        OR: [
          { gameMasterId: ctx.session.user.id },
          { characters: { some: { userId: ctx.session.user.id } } },
        ],
      },
      include: {
        gameMaster: {
          select: { id: true, name: true, image: true },
        },
        characters: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  addCharacterToGame: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        characterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true, gameId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only add your own characters to campaigns");
      }

      // Verify the game exists
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      // For non-game masters, prevent adding characters already in a game
      if (character.gameId && game.gameMasterId !== ctx.session.user.id) {
        throw new Error("Character is already in a game");
      }

      // For non-game masters, check if they already have a character in this game
      if (game.gameMasterId !== ctx.session.user.id) {
        const existingCharacter = await ctx.db.character.findFirst({
          where: {
            userId: ctx.session.user.id,
            gameId: input.gameId,
          },
        });

        if (existingCharacter) {
          throw new Error("You already have a character in this game");
        }
      }

      return ctx.db.character.update({
        where: { id: input.characterId },
        data: { gameId: input.gameId },
      });
    }),

  removeCharacterFromGame: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true, gameId: true },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error(
          "You can only remove your own characters from campaigns",
        );
      }

      return ctx.db.character.update({
        where: { id: input.characterId },
        data: { gameId: null },
      });
    }),

  getAvailableCharacters: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Check if user can add characters to this game
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      let canAddCharacter = false;
      let availableCharacters;

      if (game.gameMasterId === ctx.session.user.id) {
        // Game masters can add any of their characters that are not already in this game
        canAddCharacter = true;
        availableCharacters = await ctx.db.character.findMany({
          where: {
            userId: ctx.session.user.id,
            OR: [{ gameId: null }, { gameId: { not: input.gameId } }],
          },
          orderBy: { createdAt: "desc" },
        });
      } else {
        // Non-game masters can only add unassigned characters if they don't already have one in the game
        const userCharacterInGame = await ctx.db.character.findFirst({
          where: {
            userId: ctx.session.user.id,
            gameId: input.gameId,
          },
        });

        canAddCharacter = !userCharacterInGame;
        availableCharacters = await ctx.db.character.findMany({
          where: {
            userId: ctx.session.user.id,
            gameId: null,
          },
          orderBy: { createdAt: "desc" },
        });
      }

      return {
        characters: availableCharacters,
        canAddCharacter,
      };
    }),

  rollActionDice: protectedProcedure
    .input(rollActionDiceSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify user is in the game
      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
          OR: [
            { gameMasterId: ctx.session.user.id },
            { characters: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!game) {
        throw new Error("You are not authorized to roll dice in this game");
      }

      // Verify character belongs to user if provided
      if (input.characterId) {
        const character = await ctx.db.character.findFirst({
          where: {
            id: input.characterId,
            userId: ctx.session.user.id,
          },
        });

        if (!character) {
          throw new Error("Character not found or not owned by you");
        }
      }

      // Roll 2d12 (Hope and Fear)
      const hopeResult = Math.floor(Math.random() * 12) + 1;
      const fearResult = Math.floor(Math.random() * 12) + 1;
      const total = hopeResult + fearResult;

      // Apply modifier if provided
      const modifier = input.modifier ?? 0;
      const finalTotal = total + modifier;

      // Save to database
      const diceRoll = await ctx.db.diceRoll.create({
        data: {
          name: input.name,
          rollType: "Action",
          diceExpression: "2d12",
          individualResults: [hopeResult, fearResult],
          total,
          modifier: modifier !== 0 ? modifier : null,
          finalTotal: modifier !== 0 ? finalTotal : null,
          hopeResult,
          fearResult,
          gameId: input.gameId,
          userId: ctx.session.user.id,
          characterId: input.characterId,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          character: { select: { id: true, name: true } },
        },
      });

      // Check if this is a "With Fear" roll and add Fear for game master
      const rollOutcome = getDiceRollOutcome(hopeResult, fearResult);
      if (rollOutcome === "with Fear") {
        // Silently add Fear to the game master (no await to avoid slowing down the roll)
        void ctx.db.gameMasterFear
          .upsert({
            where: {
              gameId_userId: {
                gameId: input.gameId,
                userId: game.gameMasterId,
              },
            },
            update: {
              fearCount: {
                increment: 1,
              },
            },
            create: {
              gameId: input.gameId,
              userId: game.gameMasterId,
              fearCount: 1,
            },
          })
          .then((fear) => {
            let finalFearCount = fear.fearCount;

            // Cap at 12
            if (fear.fearCount > 12) {
              finalFearCount = 12;
              return ctx.db.gameMasterFear
                .update({
                  where: {
                    gameId_userId: {
                      gameId: input.gameId,
                      userId: game.gameMasterId,
                    },
                  },
                  data: {
                    fearCount: 12,
                  },
                })
                .then(() => {
                  // Emit event for real-time updates
                  gameEmitter.emit("fearUpdate", {
                    gameId: input.gameId,
                    fearCount: 12,
                    updatedAt: new Date(),
                  });
                });
            } else {
              // Emit event for real-time updates
              gameEmitter.emit("fearUpdate", {
                gameId: input.gameId,
                fearCount: finalFearCount,
                updatedAt: new Date(),
              });
            }
          });
      }

      // Emit event for real-time updates
      gameEmitter.emit("newRoll", {
        id: diceRoll.id,
        gameId: input.gameId,
        name: diceRoll.name,
        rollType: diceRoll.rollType,
        total: diceRoll.total,
        modifier: diceRoll.modifier,
        finalTotal: diceRoll.finalTotal,
        hopeResult: diceRoll.hopeResult,
        fearResult: diceRoll.fearResult,
        individualResults: diceRoll.individualResults,
        diceExpression: diceRoll.diceExpression,
        createdAt: diceRoll.createdAt,
        user: diceRoll.user,
        character: diceRoll.character,
      });

      return diceRoll;
    }),

  rollDamage: protectedProcedure
    .input(rollDamageSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify user is in the game
      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
          OR: [
            { gameMasterId: ctx.session.user.id },
            { characters: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!game) {
        throw new Error("You are not authorized to roll dice in this game");
      }

      // Verify character belongs to user if provided
      if (input.characterId) {
        const character = await ctx.db.character.findFirst({
          where: {
            id: input.characterId,
            userId: ctx.session.user.id,
          },
        });

        if (!character) {
          throw new Error("Character not found or not owned by you");
        }
      }

      // Roll the damage dice
      const diceMax = parseInt(input.diceType.slice(1));
      const results: number[] = [];

      for (let i = 0; i < input.quantity; i++) {
        results.push(Math.floor(Math.random() * diceMax) + 1);
      }

      const total = results.reduce((sum, result) => sum + result, 0);
      const diceExpression = `${input.quantity}${input.diceType}`;

      // Save to database
      const diceRoll = await ctx.db.diceRoll.create({
        data: {
          name: input.name,
          rollType: "Damage",
          diceExpression,
          individualResults: results,
          total,
          gameId: input.gameId,
          userId: ctx.session.user.id,
          characterId: input.characterId,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          character: { select: { id: true, name: true } },
        },
      });

      // Emit event for real-time updates
      gameEmitter.emit("newRoll", {
        id: diceRoll.id,
        gameId: input.gameId,
        name: diceRoll.name,
        rollType: diceRoll.rollType,
        total: diceRoll.total,
        modifier: null,
        finalTotal: null,
        hopeResult: null,
        fearResult: null,
        individualResults: diceRoll.individualResults,
        diceExpression: diceRoll.diceExpression,
        createdAt: diceRoll.createdAt,
        user: diceRoll.user,
        character: diceRoll.character,
      });

      return diceRoll;
    }),

  getRecentRolls: protectedProcedure
    .input(z.object({ gameId: z.string(), limit: z.number().default(20) }))
    .query(async ({ ctx, input }) => {
      // Verify user is in the game
      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
          OR: [
            { gameMasterId: ctx.session.user.id },
            { characters: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!game) {
        throw new Error("You are not authorized to view rolls in this game");
      }

      return ctx.db.diceRoll.findMany({
        where: { gameId: input.gameId },
        include: {
          user: { select: { id: true, name: true, image: true } },
          character: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
    }),

  clearRolls: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user is the game master
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.gameMasterId !== ctx.session.user.id) {
        throw new Error("Only the game master can clear dice rolls");
      }

      // Delete all dice rolls for this game
      const result = await ctx.db.diceRoll.deleteMany({
        where: { gameId: input.gameId },
      });

      return { deletedCount: result.count };
    }),

  onDiceRoll: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .subscription(async ({ ctx, input }) => {
      // Verify user is in the game
      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
          OR: [
            { gameMasterId: ctx.session.user.id },
            { characters: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!game) {
        throw new Error(
          "You are not authorized to subscribe to rolls in this game",
        );
      }

      return observable((emit) => {
        const onNewRoll = (data: DiceRollEventData) => {
          if (data.gameId === input.gameId) {
            emit.next(data);
          }
        };

        gameEmitter.on("newRoll", onNewRoll);

        return () => {
          gameEmitter.off("newRoll", onNewRoll);
        };
      });
    }),

  // Get Fear count for a game master in a specific game
  getFear: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      const fear = await ctx.db.gameMasterFear.findUnique({
        where: {
          gameId_userId: {
            gameId: input.gameId,
            userId: ctx.session.user.id,
          },
        },
      });

      return fear?.fearCount ?? 0;
    }),

  // Update Fear count for a game master
  updateFear: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        fearCount: z.number().int().min(0).max(12),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user is the game master of this game
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true },
      });

      if (!game || game.gameMasterId !== ctx.session.user.id) {
        throw new Error("You are not the game master of this game");
      }

      const result = await ctx.db.gameMasterFear.upsert({
        where: {
          gameId_userId: {
            gameId: input.gameId,
            userId: ctx.session.user.id,
          },
        },
        update: {
          fearCount: input.fearCount,
        },
        create: {
          gameId: input.gameId,
          userId: ctx.session.user.id,
          fearCount: input.fearCount,
        },
      });

      // Emit event for real-time updates
      gameEmitter.emit("fearUpdate", {
        gameId: input.gameId,
        fearCount: input.fearCount,
        updatedAt: new Date(),
      });

      return result;
    }),

  // Add Fear when a "With Fear" roll occurs
  addFear: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get the game to find the game master
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true },
      });

      if (!game) {
        throw new Error("Game not found");
      }

      // Get current fear count
      const currentFear = await ctx.db.gameMasterFear.findUnique({
        where: {
          gameId_userId: {
            gameId: input.gameId,
            userId: game.gameMasterId,
          },
        },
      });

      const newFearCount = Math.min(12, (currentFear?.fearCount ?? 0) + 1);

      const result = await ctx.db.gameMasterFear.upsert({
        where: {
          gameId_userId: {
            gameId: input.gameId,
            userId: game.gameMasterId,
          },
        },
        update: {
          fearCount: newFearCount,
        },
        create: {
          gameId: input.gameId,
          userId: game.gameMasterId,
          fearCount: newFearCount,
        },
      });

      // Emit event for real-time updates
      gameEmitter.emit("fearUpdate", {
        gameId: input.gameId,
        fearCount: newFearCount,
        updatedAt: new Date(),
      });

      return result;
    }),

  // Subscribe to Fear updates for a specific game
  onFearUpdate: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .subscription(async ({ ctx, input }) => {
      // Verify user is in the game
      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
          OR: [
            { gameMasterId: ctx.session.user.id },
            { characters: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!game) {
        throw new Error(
          "You are not authorized to subscribe to fear updates in this game",
        );
      }

      return observable<FearUpdateEventData>((emit) => {
        const onFearUpdate = (data: FearUpdateEventData) => {
          if (data.gameId === input.gameId) {
            emit.next(data);
          }
        };

        gameEmitter.on("fearUpdate", onFearUpdate);

        return () => {
          gameEmitter.off("fearUpdate", onFearUpdate);
        };
      });
    }),

  rollCustomDice: protectedProcedure
    .input(rollCustomDiceSchema)
    .mutation(async ({ ctx, input }) => {
      // Import the dice roller
      const { DiceRoller } = await import("@dice-roller/rpg-dice-roller");

      // Verify user is in the game
      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
          OR: [
            { gameMasterId: ctx.session.user.id },
            { characters: { some: { userId: ctx.session.user.id } } },
          ],
        },
      });

      if (!game) {
        throw new Error("You are not authorized to roll dice in this game");
      }

      // Verify character belongs to user if provided
      if (input.characterId) {
        const character = await ctx.db.character.findFirst({
          where: {
            id: input.characterId,
            userId: ctx.session.user.id,
          },
        });
        if (!character) {
          throw new Error("Character not found or not owned by you");
        }
      }

      try {
        // Create a new dice roller instance and roll the dice
        const diceRoller = new DiceRoller();
        const rollResult = diceRoller.roll(
          input.diceExpression,
        ) as DiceRollResult;

        console.log(
          "Dice roll result structure:",
          JSON.stringify(rollResult, null, 2),
        );

        // Extract results
        const total = rollResult.total;
        const individualResults: number[] = [];

        // Extract individual die results from the notation
        // The structure varies depending on the dice expression
        if (rollResult.rolls && Array.isArray(rollResult.rolls)) {
          rollResult.rolls.forEach((rollGroup: DiceRollGroup) => {
            if (rollGroup.rolls && Array.isArray(rollGroup.rolls)) {
              rollGroup.rolls.forEach((die: IndividualRoll) => {
                if (die.value !== undefined) {
                  individualResults.push(die.value);
                }
              });
            } else if (rollGroup.value !== undefined) {
              // Single die or modifier
              individualResults.push(rollGroup.value);
            }
          });
        }

        // If we couldn't extract individual results, try alternative approach
        if (individualResults.length === 0 && rollResult.output) {
          // Parse from the output string as fallback
          const regex = /\[([^\]]+)\]/;
          const matches = regex.exec(rollResult.output);
          if (matches?.[1]) {
            const rollsString = matches[1];
            const rolls = rollsString
              .split(",")
              .map((r: string) => parseInt(r.trim()))
              .filter((n: number) => !isNaN(n));
            individualResults.push(...rolls);
          }
        }

        // Save to database
        const diceRoll = await ctx.db.diceRoll.create({
          data: {
            name: input.name,
            rollType: "Custom",
            diceExpression: input.diceExpression,
            individualResults,
            total,
            gameId: input.gameId,
            userId: ctx.session.user.id,
            characterId: input.characterId,
          },
          include: {
            user: { select: { id: true, name: true, image: true } },
            character: { select: { id: true, name: true } },
          },
        });

        // Emit event for real-time updates
        gameEmitter.emit("newRoll", {
          id: diceRoll.id,
          gameId: input.gameId,
          name: diceRoll.name,
          rollType: diceRoll.rollType,
          total: diceRoll.total,
          modifier: null,
          finalTotal: null,
          hopeResult: null,
          fearResult: null,
          diceExpression: diceRoll.diceExpression,
          individualResults: diceRoll.individualResults,
          user: diceRoll.user,
          character: diceRoll.character,
          createdAt: diceRoll.createdAt,
        } as DiceRollEventData);

        return diceRoll;
      } catch (error) {
        console.error("Dice rolling error:", error);
        console.error("Dice expression:", input.diceExpression);
        throw new Error(
          `Invalid dice expression "${input.diceExpression}": ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),
});
