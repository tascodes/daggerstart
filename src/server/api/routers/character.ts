import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
  experience1: z
    .string()
    .max(50, "Experience must be less than 50 characters")
    .optional(),
  experience2: z
    .string()
    .max(50, "Experience must be less than 50 characters")
    .optional(),
});

export const characterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createCharacterSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.character.create({
        data: {
          name: input.name,
          pronouns: input.pronouns,
          class: input.class,
          subclass: input.subclass,
          ancestry: input.ancestry,
          community: input.community,
          level: input.level,
          experience1: input.experience1,
          experience2: input.experience2,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.character.findMany({
      where: { userId: ctx.session.user.id },
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
        },
      });

      if (!character) {
        throw new Error("Character not found");
      }

      // Allow viewing if user owns the character OR is in the same game
      const canView = 
        character.userId === ctx.session.user.id ||
        (character.game && await ctx.db.game.findFirst({
          where: {
            id: character.game.id,
            OR: [
              { gameMasterId: ctx.session.user.id },
              { characters: { some: { userId: ctx.session.user.id } } },
            ],
          },
        }));

      if (!canView) {
        throw new Error("You don't have permission to view this character");
      }

      return character;
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
});
