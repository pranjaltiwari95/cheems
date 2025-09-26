import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getMe } from "./users"; // ✨ 1. Import the single, reliable helper

/**
 * Creates a new conversation between an adopter and a shelter for a specific dog,
 * or returns the ID of an existing conversation if one already exists.
 * This is an internal mutation, intended to be called from an action.
 */
export const createOrGetConversation = internalMutation({
  args: {
    dogId: v.id("dogs"),
  },
  handler: async (ctx, args) => {
    // ✨ 2. Use the standardized 'getMe' helper
    const adopter = await getMe(ctx);

    if (!adopter) {
      throw new Error("Cannot create conversation for unauthenticated user.");
    }

    const dog = await ctx.db.get(args.dogId);
    if (!dog) {
      throw new Error("Dog not found");
    }
    const shelterId = dog.shelterId;

    // Check if a conversation for this adopter and dog already exists
    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_adopter_and_dog", (q) =>
        q.eq("adopterId", adopter._id).eq("dogId", args.dogId)
      )
      .unique();

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create a new conversation if one doesn't exist
    const conversationId = await ctx.db.insert("conversations", {
      adopterId: adopter._id,
      shelterId,
      dogId: args.dogId,
    });

    return conversationId;
  },
});

/**
 * Fetches all conversations for the currently logged-in user,
 * whether they are the adopter or the shelter. It also "joins"
 * the related dog and other user's data for easy display on the frontend.
 */
export const getConversationsForUser = query({
  handler: async (ctx) => {
    // ✨ 3. Use the 'getMe' helper to safely get the user
    const user = await getMe(ctx);

    // ✨ 4. If the user isn't found (due to the race condition), return an empty list
    if (!user) {
      return [];
    }

    // Get all conversations where the user is the adopter
    const conversationsAsAdopter = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("adopterId"), user._id))
      .collect();

    // Get all conversations where the user is the shelter
    const conversationsAsShelter = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("shelterId"), user._id))
      .collect();

    const allConversations = [
      ...conversationsAsAdopter,
      ...conversationsAsShelter,
    ];

    // Augment conversations with details from related tables
    const conversationsWithDetails = await Promise.all(
      allConversations.map(async (convo) => {
        const dog = await ctx.db.get(convo.dogId);

        // Determine who the "other user" is in the chat
        const otherUserId =
          user._id === convo.adopterId ? convo.shelterId : convo.adopterId;
        const otherUser = await ctx.db.get(otherUserId);

        return {
          ...convo,
          dogName: dog?.name,
          dogImageUrl: dog?.imageUrls[0],
          otherUserName: otherUser?.name,
          otherUserRole: otherUser?.role,
        };
      })
    );

    // Sort by creation time to show newest conversations first
    return conversationsWithDetails.sort(
      (a, b) => b._creationTime - a._creationTime
    );
  },
});

/**
 * Fetches the specific details for a single conversation, used for the chat header.
 */
export const getConversationDetails = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // ✨ 5. Use the standardized 'getMe' helper here as well
    const user = await getMe(ctx);
    if (!user) return null;

    const conversation = await ctx.db.get(args.id);
    if (!conversation) return null;

    const dog = await ctx.db.get(conversation.dogId);
    const otherUserId =
      user._id === conversation.adopterId
        ? conversation.shelterId
        : conversation.adopterId;
    const otherUser = await ctx.db.get(otherUserId);

    return {
      dogName: dog?.name,
      dogImageUrl: dog?.imageUrls[0],
      otherUserName: otherUser?.name,
      otherUserImageUrl: otherUser?.imageUrl,
    };
  },
});
