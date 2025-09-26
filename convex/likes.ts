import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./util"; // 👈 Import 'getUser'

export const likeDog = internalMutation({
  args: {
    dogId: v.id("dogs"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx); // 👈 Use the new helper

    // Check if a like already exists to prevent duplicates
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_adopter_and_dog", (q) =>
        // 👇 Use user._id, which has the correct type
        q.eq("adopterId", user._id).eq("dogId", args.dogId)
      )
      .unique();

    if (existingLike) {
      return existingLike._id; // Already liked
    }

    const likeId = await ctx.db.insert("likes", {
      // 👇 Use user._id here as well
      adopterId: user._id,
      dogId: args.dogId,
    });

    return likeId;
  },
});
