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
});
