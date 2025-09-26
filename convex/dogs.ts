import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getMe } from "./users"; // ✨ 1. Import the single, reliable helper
import { Doc } from "./_generated/dataModel";

/**
 * Query to get all dogs listed by the currently logged-in shelter.
 * Made safe against the race condition.
 */
export const getDogsForCurrentShelter = query({
  handler: async (ctx) => {
    // ✨ 2. Use the 'getMe' helper to safely get the user
    const user = await getMe(ctx);

    if (!user || user.role !== "shelter") {
      // If no user or the user is not a shelter, return an empty list
      return [];
    }

    const dogs = await ctx.db
      .query("dogs")
      .withIndex("by_shelter_id", (q) => q.eq("shelterId", user._id))
      .order("desc")
      .collect();

    return dogs;
  },
});

/**
 * Mutation to add a new dog.
 */
export const addDog = mutation({
  args: {
    name: v.string(),
    age: v.number(),
    breed: v.string(),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    description: v.string(),
    vaccinationStatus: v.string(),
    healthStatus: v.string(),
    imageUrls: v.array(v.string()),
    voiceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getMe(ctx);

    if (!user || user.role !== "shelter") {
      throw new Error("Only authenticated shelters can add dogs.");
    }

    const dogId = await ctx.db.insert("dogs", {
      shelterId: user._id,
      status: "available",
      ...args,
    });

    return dogId;
  },
});

/**
 * Mutation to update an existing dog's profile.
 */
export const updateDog = mutation({
  args: {
    dogId: v.id("dogs"),
    name: v.optional(v.string()),
    age: v.optional(v.number()),
    breed: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
    description: v.optional(v.string()),
    vaccinationStatus: v.optional(v.string()),
    healthStatus: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getMe(ctx);
    const { dogId, ...rest } = args;

    if (!user) {
      throw new Error("You must be logged in to update a dog profile.");
    }

    const dog = await ctx.db.get(dogId);

    if (!dog || dog.shelterId !== user._id) {
      throw new Error("You are not authorized to update this dog profile.");
    }

    await ctx.db.patch(dogId, rest);
  },
});

/**
 * Mutation to remove a dog listing.
 */
export const removeDog = mutation({
  args: { dogId: v.id("dogs") },
  handler: async (ctx, args) => {
    const user = await getMe(ctx);
    if (!user) {
      throw new Error("You must be logged in to remove a dog.");
    }

    const dog = await ctx.db.get(args.dogId);

    if (!dog || dog.shelterId !== user._id) {
      throw new Error("You are not authorized to remove this dog.");
    }

    await ctx.db.delete(args.dogId);
  },
});

/**
 * Specific mutation to mark a dog as adopted.
 */
export const markDogAsAdopted = mutation({
  args: { dogId: v.id("dogs") },
  handler: async (ctx, args) => {
    const user = await getMe(ctx);
    if (!user) {
      throw new Error("You must be logged in to modify a dog's status.");
    }
    const dog = await ctx.db.get(args.dogId);

    if (!dog || dog.shelterId !== user._id) {
      throw new Error("You are not authorized to modify this dog's status.");
    }

    await ctx.db.patch(args.dogId, { status: "adopted" });
  },
});

/**
 * Query to get available dogs for an adopter to swipe through.
 * Made safe against the race condition.
 */
export const getDogsForAdopter = query({
  handler: async (ctx) => {
    // ✨ 3. Use the 'getMe' helper to safely get the user
    const user = await getMe(ctx);

    // ✨ 4. If the user isn't found, return an empty list
    if (!user) {
      return [];
    }

    const userLikes = await ctx.db
      .query("likes")
      .withIndex("by_adopter_and_dog", (q) => q.eq("adopterId", user._id))
      .collect();

    const likedDogIds = new Set(userLikes.map((like) => like.dogId));

    const allAvailableDogs = await ctx.db
      .query("dogs")
      .filter((q) => q.eq(q.field("status"), "available"))
      .collect();

    const dogsToShow = allAvailableDogs.filter(
      (dog) => !likedDogIds.has(dog._id)
    );

    return dogsToShow;
  },
});

/**
 * Query to get all dogs an adopter has liked.
 * Made safe against the race condition.
 */
export const getLikedDogsForUser = query({
  handler: async (ctx) => {
    // ✨ 5. Use the 'getMe' helper to safely get the user
    const user = await getMe(ctx);

    // ✨ 6. If the user isn't found, return an empty list
    if (!user) {
      return [];
    }

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_adopter_and_dog", (q) => q.eq("adopterId", user._id))
      .collect();

    const likedDogs = await Promise.all(
      likes.map((like) => ctx.db.get(like.dogId))
    );

    return likedDogs.filter((dog): dog is Doc<"dogs"> => dog !== null);
  },
});
