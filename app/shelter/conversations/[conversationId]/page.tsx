"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { FormEvent, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Main Chat Page Component
export default function ChatPage() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversationId = params.conversationId as any;
  const convexUser = useQuery(api.users.getCurrentUser);
  const messages = useQuery(api.messages.getMessages, { conversationId });
  const conversationDetails = useQuery(
    api.conversations.getConversationDetails,
    {
      id: conversationId,
    }
  );
  const sendMessage = useMutation(api.messages.sendMessage);

  const [text, setText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    try {
      await sendMessage({ conversationId, text });
      setText("");
    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message:", error);
    }
  };

  return (
    // PARENT CONTAINER
    // flex       -> Enables flexbox layout
    // h-screen   -> Sets height to 100% of the viewport height. This is essential.
    // flex-col   -> Stacks children vertically (Header, then Messages, then Input).
    <div className="bg-muted/20 flex h-screen flex-col">
      {/* 1. HEADER (Fixed at the top) */}
      {/* This component takes its natural height and sits at the top of the flex container. */}
      <ChatHeader details={conversationDetails} />

      {/* 2. SCROLLABLE MESSAGE AREA */}
      {/* flex-1            -> Makes this div grow to fill all remaining vertical space. */}
      {/* overflow-y-auto   -> Adds a scrollbar ONLY to this div if messages overflow. */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages === undefined && <ChatSkeleton />}

          {messages?.map((message) => (
            <div
              key={message._id}
              className={cn(
                "flex",
                message.authorId === convexUser?._id
                  ? "justify-end"
                  : "justify-start"
              )}
            >
              <ChatMessage
                isMe={message.authorId === convexUser?._id}
                authorName={message.authorName}
                authorImageUrl={message.authorImageUrl}
                text={message.text}
                timestamp={message._creationTime}
              />
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 3. INPUT FORM (Fixed at the bottom) */}
      {/* This component takes its natural height and is pushed to the bottom by the `flex-1` div above it. */}
      <div className="border-t p-4 shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-4xl items-center space-x-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!text.trim()}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

// ✨ New Header Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChatHeader({ details }: { details: any }) {
  if (details === undefined) return <HeaderSkeleton />;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={details?.dogImageUrl} />
            <AvatarFallback>{details?.dogName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <p className="font-bold">Chat about {details?.dogName}</p>
            <p className="text-muted-foreground text-sm">
              with {details?.otherUserName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

// Sub-component for a single chat message
function ChatMessage({
  isMe,
  authorName,
  authorImageUrl,
  text,
  timestamp,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const initials = authorName?.substring(0, 2).toUpperCase() || "U";
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex max-w-lg items-end gap-3")}>
      {!isMe && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={authorImageUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            "rounded-2xl p-3 text-sm shadow-sm",
            // ✨ 3. Fix: Using theme-aware colors for better light/dark mode
            isMe
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-background rounded-bl-none border"
          )}
        >
          <p>{text}</p>
        </div>
        <span
          className={cn(
            "text-muted-foreground text-xs",
            isMe ? "text-right" : "text-left"
          )}
        >
          {time}
        </span>
      </div>
      {isMe && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={authorImageUrl} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// Loading Skeletons
function HeaderSkeleton() {
  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <div className="mx-auto flex max-w-4xl items-center p-3">
        <Skeleton className="mr-2 h-10 w-10" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-4 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </Card>
  );
}
// Sub-component for the loading skeleton
function ChatSkeleton() {
  return (
    <>
      <div className="flex items-end gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-16 w-48 rounded-2xl rounded-bl-none" />
      </div>
      <div className="flex items-end justify-end gap-3">
        <Skeleton className="h-20 w-64 rounded-2xl rounded-br-none" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="flex items-end gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-40 rounded-2xl rounded-bl-none" />
      </div>
    </>
  );
}
