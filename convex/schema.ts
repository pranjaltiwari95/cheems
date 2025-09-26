import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // ...existing user fields
    name: v.string(),
    clerkId: v.string(),
    email: v.string(),
    role: v.optional(v.union(v.literal("shelter"), v.literal("adopter"))),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  // 👇 New table for dogs
  dogs: defineTable({
    shelterId: v.id("users"),
    name: v.string(),
    age: v.number(),
    breed: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    description: v.string(),
    vaccinationStatus: v.string(),
    healthStatus: v.string(),
    imageUrls: v.array(v.string()),
    voiceUrl: v.optional(v.string()),
    status: v.union(v.literal("available"), v.literal("adopted")),
  }).index("by_shelter_id", ["shelterId"]),

  // 👇 New table to track when an adopter likes a dog
  likes: defineTable({
    adopterId: v.id("users"),
    dogId: v.id("dogs"),
  }).index("by_adopter_and_dog", ["adopterId", "dogId"]),

  // 👇 New table for conversation threads
  conversations: defineTable({
    adopterId: v.id("users"),
    shelterId: v.id("users"),
    dogId: v.id("dogs"),
  }).index("by_adopter_and_dog", ["adopterId", "dogId"]),

  // 👇 New table for individual chat messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    authorId: v.id("users"), // The user who sent the message
    text: v.string(),
  }).index("by_conversation_id", ["conversationId"]),
});
