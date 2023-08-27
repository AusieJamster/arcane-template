import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const productsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // const product = await ctx.prisma.products.findUnique({
      //   where: { id: input.id },
      // });

      const product = await stripe.products.retrieve(input.id);

      if (!product) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToPosts([product]))[0];
    }),
});
