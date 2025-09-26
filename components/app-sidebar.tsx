"use client";

import { Heart, LayoutDashboard, Cat } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "./ui/skeleton";

const adopterLinks = [
  {
    title: "Find Dogs",
    url: "/adopter/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Your Interests",
    url: "/adopter/interests",
    icon: Heart,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Fetch the user's conversations in real-time
  const conversations = useQuery(api.conversations.getConversationsForUser);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src="/logo.png" alt="Logo" width={100} height={40} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Adopter Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-md">Adopter</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adopterLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dynamic Conversations Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-md">Connections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* --- Loading State --- */}
              {conversations === undefined && (
                <div className="flex flex-col gap-2 px-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              )}

              {/* --- Empty State --- */}
              {conversations && conversations.length === 0 && (
                <p className="text-muted-foreground px-3 text-sm">
                  No chats yet.
                </p>
              )}

              {/* --- Data State --- */}
              {conversations?.map((convo) => (
                <SidebarMenuItem key={convo._id}>
                  <Link href={`/adopter/conversations/${convo._id}`}>
                    <SidebarMenuButton asChild className="justify-start">
                      <div className="flex items-center">
                        <Cat className="mr-3 h-5 w-5 shrink-0" />
                        <span className="truncate">
                          Chat about {convo.dogName}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
