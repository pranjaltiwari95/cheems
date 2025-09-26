import {
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";

// =================================================================
// HELPERS (for internal backend use)
// =================================================================

/**
 * The single, reliable helper to get the current user's document.
 * Returns `null` if the user is not authenticated or not found in the database.
 * THIS IS THE CORE OF THE RACE CONDITION FIX.
 * @param ctx - The Convex query or mutation context.
 * @returns The user document or `null`.
 */
export async function getMe(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null; // Not authenticated
  }
  // Find the user document corresponding to the Clerk user ID
  const user = await userByClerkId(ctx, identity.subject);

  if (!user) {
    // This can happen briefly during sign up while the webhook is processing
    return null;
  }
  return user;
}

/**
 * Helper to find a user by their Clerk ID string.
 * @param ctx - The Convex query or mutation context.
 * @param clerkId - The Clerk user ID.
 * @returns The user document or `null`.
 */
async function userByClerkId(ctx: QueryCtx | MutationCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

// =================================================================
// CLIENT-FACING QUERIES & MUTATIONS (Callable from the frontend)
// =================================================================

/**
 * The main query for the client to get their own user data.
 * The client should use this in a `useQuery`.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getMe(ctx);
  },
});

/**
 * Mutation for the user to update their profile after onboarding.
 */
export const updateUserProfile = mutation({
  args: {
    role: v.union(v.literal("shelter"), v.literal("adopter")),
    address: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getMe(ctx);

    if (!user) {
      throw new Error("User not found, cannot update profile.");
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      address: args.address,
      phone: args.phone,
    });
  },
});

// =================================================================
// INTERNAL FUNCTIONS (for Webhooks & Server-to-Server calls)
// =================================================================

/**
 * Internal mutation to create or update a user from a Clerk webhook.
 */
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const primaryEmail =
      data.email_addresses.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ?? "";

    const userAttributes = {
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      clerkId: data.id,
      email: primaryEmail,
      imageUrl: data.image_url,
    };

    const user = await userByClerkId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

/**
 * Internal mutation to delete a user from a Clerk webhook.
 */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

/**
 * Internal query for server-to-server calls to get a user by their Clerk ID.
 */
export const getInternalUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, { clerkId }) {
    return await userByClerkId(ctx, clerkId);
  },
});
