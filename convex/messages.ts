import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getMe } from "./users"; // ✨ 1. Import the new, correct helper

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_id", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();

    // For each message, fetch the author's details
    const messagesWithAuthors = await Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          ...message,
          authorName: author?.name,
          authorImageUrl: author?.imageUrl,
        };
      })
    );
    return messagesWithAuthors;
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // ✨ 2. Use the 'getMe' helper instead of the old function
    const user = await getMe(ctx);

    // ✨ 3. Add a check to ensure the user is found before proceeding
    if (!user) {
      throw new Error("You must be logged in to send a message.");
    }

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      authorId: user._id,
      text: args.text,
    });
  },
});
