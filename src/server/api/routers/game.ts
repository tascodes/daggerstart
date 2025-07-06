import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

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
            select: { id: true, name: true, image: true }
          },
          characters: {
            include: {
              user: {
                select: { id: true, name: true, image: true }
              }
            }
          },
          _count: {
            select: { characters: true }
          }
        }
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the user is the game master
      const game = await ctx.db.game.findUnique({
        where: { id: input.id },
        select: { gameMasterId: true }
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.gameMasterId !== ctx.session.user.id) {
        throw new Error("Only the game master can delete this game");
      }

      return ctx.db.game.delete({
        where: { id: input.id }
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const game = await ctx.db.game.findUnique({
        where: { id: input.id },
        include: {
          gameMaster: {
            select: { id: true, name: true, image: true }
          },
          characters: {
            include: {
              user: {
                select: { id: true, name: true, image: true }
              }
            }
          },
          _count: {
            select: { characters: true }
          }
        }
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
          { characters: { some: { userId: ctx.session.user.id } } }
        ]
      },
      include: {
        gameMaster: {
          select: { id: true, name: true, image: true }
        },
        characters: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        },
        _count: {
          select: { characters: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }),

  addCharacterToGame: protectedProcedure
    .input(z.object({
      gameId: z.string(),
      characterId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true, gameId: true }
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only add your own characters to games");
      }

      if (character.gameId) {
        throw new Error("Character is already in a game");
      }

      // Verify the game exists and user is not the game master
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true }
      });

      if (!game) {
        throw new Error("Game not found");
      }

      if (game.gameMasterId === ctx.session.user.id) {
        throw new Error("Game masters cannot add characters to their own games");
      }

      // Check if user already has a character in this game
      const existingCharacter = await ctx.db.character.findFirst({
        where: {
          userId: ctx.session.user.id,
          gameId: input.gameId
        }
      });

      if (existingCharacter) {
        throw new Error("You already have a character in this game");
      }

      return ctx.db.character.update({
        where: { id: input.characterId },
        data: { gameId: input.gameId }
      });
    }),

  removeCharacterFromGame: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify the character belongs to the user
      const character = await ctx.db.character.findUnique({
        where: { id: input.characterId },
        select: { userId: true, gameId: true }
      });

      if (!character) {
        throw new Error("Character not found");
      }

      if (character.userId !== ctx.session.user.id) {
        throw new Error("You can only remove your own characters from games");
      }

      return ctx.db.character.update({
        where: { id: input.characterId },
        data: { gameId: null }
      });
    }),

  getAvailableCharacters: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Get user's characters that are not in any game
      const availableCharacters = await ctx.db.character.findMany({
        where: {
          userId: ctx.session.user.id,
          gameId: null
        },
        orderBy: { createdAt: "desc" }
      });

      // Check if user is the game master or already has a character in this game
      const game = await ctx.db.game.findUnique({
        where: { id: input.gameId },
        select: { gameMasterId: true }
      });

      const userCharacterInGame = await ctx.db.character.findFirst({
        where: {
          userId: ctx.session.user.id,
          gameId: input.gameId
        }
      });

      const canAddCharacter = game && 
        game.gameMasterId !== ctx.session.user.id && 
        !userCharacterInGame;

      return {
        characters: availableCharacters,
        canAddCharacter
      };
    })
});