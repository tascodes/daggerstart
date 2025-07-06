import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createGameSchema = z.object({
  name: z
    .string()
    .min(1, "Game name is required")
    .max(100, "Game name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

const rollActionDiceSchema = z.object({
  gameId: z.string(),
  name: z.string().min(1, "Roll name is required"),
  characterId: z.string().optional(),
});

const rollDamageSchema = z.object({
  gameId: z.string(),
  name: z.string().min(1, "Roll name is required"),
  diceType: z.enum(["d4", "d6", "d8", "d10", "d12", "d20"]),
  quantity: z.number().min(1).max(20),
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
        throw new Error("You can only add your own characters to games");
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
        throw new Error("You can only remove your own characters from games");
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
            OR: [
              { gameId: null },
              { gameId: { not: input.gameId } },
            ],
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

      // Determine outcome
      let rollOutcome: string;
      if (hopeResult === fearResult) {
        rollOutcome = "Critical Success";
      } else if (hopeResult > fearResult) {
        rollOutcome = "with Hope";
      } else {
        rollOutcome = "with Fear";
      }

      // Save to database
      const diceRoll = await ctx.db.diceRoll.create({
        data: {
          name: input.name,
          rollType: "Action",
          diceExpression: "2d12",
          individualResults: [hopeResult, fearResult],
          total,
          hopeResult,
          fearResult,
          rollOutcome,
          gameId: input.gameId,
          userId: ctx.session.user.id,
          characterId: input.characterId,
        },
        include: {
          user: { select: { id: true, name: true, image: true } },
          character: { select: { id: true, name: true } },
        },
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
});
