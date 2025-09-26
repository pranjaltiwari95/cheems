import { MutationCtx, QueryCtx } from "./_generated/server";

/**
 * A helper function to get the full user document from the database.
 * Throws an error if the user is not authenticated or not found.
 * @param ctx - The Convex query or mutation context.
 * @returns The user document.
 */
export async function getUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("User is not authenticated.");
  }

  // Find the user document corresponding to the Clerk user ID
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) {
    throw new Error("Authenticated user not found in the database.");
  }

  return user;
}
