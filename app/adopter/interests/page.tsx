"use client";

import { useConvexAuth, useQuery } from "convex/react"; // ✨ 1. Import useConvexAuth
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartCrack } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function YourInterestsPage() {
  // ✨ 2. Get the authentication loading state
  const { isLoading: isAuthLoading } = useConvexAuth();

  // ✨ 3. Skip the query if authentication is still loading
  const likedDogs = useQuery(
    api.dogs.getLikedDogsForUser,
    isAuthLoading ? "skip" : undefined
  );

  return (
    <>
      <SiteHeader heading="Your Interests" />
      <div className="p-4 md:p-8">
        {/* This h1 can be removed as SiteHeader now handles it */}
        {/* <h1 className="mb-8 text-3xl font-bold">Your Liked Dogs</h1> */}

        {/* ✨ 4. The loading state now covers both auth and data fetching */}
        {(isAuthLoading || likedDogs === undefined) && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {likedDogs && likedDogs.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
            <HeartCrack className="text-muted-foreground mb-4 h-16 w-16" />
            <h2 className="text-2xl font-semibold">No Liked Dogs Yet.</h2>
            <p className="text-muted-foreground mt-2">
              Go to the &quot;Find Dogs&quot; page to start showing interest!
            </p>
          </div>
        )}

        {/* Data State */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {likedDogs?.map((dog) => (
            <Card key={dog._id}>
              <CardHeader>
                <CardTitle>{dog.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square">
                  <Image
                    src={dog.imageUrls[0]}
                    alt={`Image of ${dog.name}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-sm">
                  {dog.breed}
                </p>
                <Badge
                  variant={dog.status === "adopted" ? "destructive" : "default"}
                  className="mt-2"
                >
                  {dog.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
