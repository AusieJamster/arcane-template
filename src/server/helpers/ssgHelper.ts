import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

export const generateSSGHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { prisma, user: null },
  transformer: superjson,
});
