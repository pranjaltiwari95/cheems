"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react"; // A nice loading spinner

export default function DashboardPage() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    // If the query is still loading, do nothing.
    if (currentUser === undefined) {
      return;
    }

    // This can happen briefly while the user is being created via webhook.
    if (currentUser === null) {
      return;
    }

    // If the user's role is not set, they need to be onboarded.
    if (!currentUser.role) {
      router.push("/onboarding");
      return;
    }

    // Redirect to the appropriate dashboard based on their role.
    if (currentUser.role === "shelter") {
      router.push("/shelter/dashboard");
    } else if (currentUser.role === "adopter") {
      router.push("/adopter/dashboard");
    }
  }, [currentUser, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}
