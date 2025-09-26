"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { ManageDogModal } from "@/components/modals/ManageDogModal";
import { SiteHeader } from "@/components/site-header";

export default function ShelterDashboardPage() {
  const dogs = useQuery(api.dogs.getDogsForCurrentShelter);
  const [editingDog, setEditingDog] = useState<Doc<"dogs"> | null>(null);

  return (
    <>
      <SiteHeader heading="Shelter Dashboard" />
      <div className="p-4 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Dog Listings</h1>
            <p className="text-muted-foreground">
              Manage your shelter&#39;s dogs here.
            </p>
          </div>
          <Button asChild>
            <Link href="/shelter/dashboard/dogs/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Dog
            </Link>
          </Button>
        </div>

        {dogs === undefined && <div>Loading your listings...</div>}

        {dogs && dogs.length === 0 && (
          <div className="rounded-lg border-2 border-dashed py-16 text-center">
            <h2 className="text-xl font-semibold">No dogs listed yet.</h2>
            <p className="text-muted-foreground mt-2">
              Click the &quot;Add New Dog&quot; button to create your first
              listing!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dogs?.map((dog) => (
            <Card key={dog._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {dog.name}
                  <Badge
                    variant={
                      dog.status === "adopted" ? "destructive" : "default"
                    }
                  >
                    {dog.status}
                  </Badge>
                </CardTitle>
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
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setEditingDog(dog)}
                  variant="outline"
                  className="w-full"
                >
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <ManageDogModal
          dog={editingDog}
          isOpen={!!editingDog}
          onClose={() => setEditingDog(null)}
        />
      </div>
    </>
  );
}
