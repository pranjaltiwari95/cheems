import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Action to handle liking a dog and creating a conversation
export const likeDogAndCreateConversation: ReturnType<typeof action> = action({
  args: {
    dogId: v.id("dogs"),
  },
  handler: async (ctx, args) => {
    // Step 1: Create the 'like' record
    const likeId = await ctx.runMutation(internal.likes.likeDog, {
      dogId: args.dogId,
    });

    // Step 2: Create the conversation
    await ctx.runMutation(internal.conversations.createOrGetConversation, {
      dogId: args.dogId,
    });

    return likeId;
  },
});
