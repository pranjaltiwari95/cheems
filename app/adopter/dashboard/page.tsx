"use client";

import { useConvexAuth, useAction, useQuery } from "convex/react"; // ✨ 1. Import useConvexAuth
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { Heart, X, Dog, Syringe, HeartPulse } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

const randomRotate = () => Math.floor(Math.random() * 10) - 5;

export default function AdopterDashboardPage() {
  // ✨ 2. Get the authentication loading state
  const { isLoading: isAuthLoading } = useConvexAuth();

  // ✨ 3. Skip the query if authentication is still loading
  const allDogs = useQuery(
    api.dogs.getDogsForAdopter,
    isAuthLoading ? "skip" : undefined
  );

  const likeDog = useAction(api.actions.likeDogAndCreateConversation);

  const [dogQueue, setDogQueue] = useState<Doc<"dogs">[] | undefined>(
    undefined
  );

  useEffect(() => {
    // Only set the queue if allDogs is not undefined (i.e., the query has run)
    if (allDogs) {
      setDogQueue(allDogs);
    }
  }, [allDogs]);

  const currentDog = dogQueue?.[0];

  const handleSkip = () => {
    if (dogQueue && dogQueue.length > 0) {
      setDogQueue((prevQueue) => {
        if (!prevQueue) return [];
        const newQueue = [...prevQueue.slice(1), prevQueue[0]]; // More efficient rotation
        return newQueue;
      });
    }
  };

  const handleLike = async () => {
    if (!currentDog) return;
    try {
      await likeDog({ dogId: currentDog._id });
      toast.success(
        `You've shown interest in ${currentDog.name}! You can now chat with the shelter.`
      );
      setDogQueue((prevQueue) =>
        prevQueue?.filter((dog) => dog._id !== currentDog._id)
      );
    } catch (error) {
      toast.error("Failed to like dog. Please try again.");
      console.error("Error liking dog:", error);
    }
  };

  // ✨ 4. The loading state now covers both auth and data fetching
  if (isAuthLoading || dogQueue === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-lg">
          Finding furry friends...
        </p>
      </div>
    );
  }

  if (!currentDog) {
    return (
      <>
        <SiteHeader heading="Dashboard" />
        <div className="flex h-[80vh] flex-col items-center justify-center p-4 text-center">
          <Dog className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="text-2xl font-bold">All Paws Accounted For! 🐾</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You&#39;ve seen all the available dogs for now. Check back later for
            new friends!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader heading="Adopter Dashboard" />
      <main className="flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center overflow-hidden bg-slate-50 p-4">
        <div className="relative h-[650px] w-full max-w-4xl md:h-[500px]">
          <AnimatePresence>
            {dogQueue
              .slice(0, 4)
              .reverse()
              .map((dog, index) => {
                const isTopCard = index === dogQueue.slice(0, 4).length - 1;

                return (
                  <motion.div
                    key={dog._id}
                    className="absolute h-full w-full origin-bottom"
                    style={{
                      zIndex: index,
                      pointerEvents: isTopCard ? "auto" : "none", // ✅ only top card is clickable
                    }}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      y: 50,
                      rotate: randomRotate(),
                    }}
                    animate={{
                      opacity: isTopCard ? 1 : 0.8 - index * 0.1,
                      scale: isTopCard ? 1 : 1 - index * 0.05,
                      y: isTopCard ? 0 : -index * 20,
                      rotate: isTopCard ? 0 : randomRotate(),
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      y: 100,
                      rotate: randomRotate(),
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <Card className="grid h-full w-full grid-cols-1 overflow-hidden rounded-2xl shadow-xl md:grid-cols-2">
                      {/* Left Side: Image */}
                      <div className="relative h-full w-full">
                        <Image
                          src={dog.imageUrls[0]}
                          alt={`Photo of ${dog.name}`}
                          fill
                          className="h-full w-full rounded-l-2xl object-cover object-center"
                          priority={isTopCard}
                        />
                      </div>

                      {/* Right Side: Details & Actions */}
                      <div className="flex flex-col p-6 lg:p-8">
                        <CardContent className="flex flex-1 flex-col p-0">
                          <div>
                            <p className="text-lg font-medium text-indigo-600">
                              {dog.breed}
                            </p>
                            <h2 className="text-4xl font-extrabold text-slate-900 lg:text-5xl">
                              {dog.name}, {dog.age}
                            </h2>
                          </div>
                          <p className="mt-4 overflow-y-auto text-base text-slate-600">
                            {dog.description}
                          </p>
                          <div className="mt-4 space-y-3">
                            <Badge
                              variant="secondary"
                              className="flex w-fit items-center gap-2 p-2 text-base"
                            >
                              <Dog className="h-4 w-4" />
                              <span>{dog.gender}</span>
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="flex w-fit items-center gap-2 p-2 text-base"
                            >
                              <Syringe className="h-4 w-4" />
                              <span>Vaccination: {dog.vaccinationStatus}</span>
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="flex w-fit items-center gap-2 p-2 text-base"
                            >
                              <HeartPulse className="h-4 w-4" />
                              <span>Health: {dog.healthStatus}</span>
                            </Badge>
                          </div>
                        </CardContent>

                        {isTopCard && (
                          <div className="mt-auto mb-5 grid grid-cols-2 gap-4 pt-6">
                            <Button
                              onClick={handleSkip}
                              variant="outline"
                              size="lg"
                              className="h-20 rounded-xl transition-all duration-200 ease-in-out hover:bg-neutral-100 hover:shadow-md"
                            >
                              <X className="h-10 w-10 text-black" />
                            </Button>
                            <Button
                              onClick={handleLike}
                              variant="outline"
                              size="lg"
                              className="h-20 rounded-xl transition-all duration-200 ease-in-out hover:bg-red-50 hover:shadow-md"
                            >
                              <Heart
                                className="h-10 w-10 text-red-500"
                                fill="currentColor"
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
