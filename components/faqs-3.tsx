"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import Link from "next/link";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export default function FAQsThree() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "paw-print",
      question: "How does Cheems work?",
      answer:
        "Cheems connects dog shelters with loving adopters. Shelters can register and post details about dogs, while adopters can browse profiles, like their favorites, and connect with shelters to start the adoption process.",
    },
    {
      id: "item-2",
      icon: "user-plus",
      question: "How do I register as a shelter or adopter?",
      answer:
        "During sign-up, you can choose to register as a shelter or an adopter. Shelters will need to provide basic details and verification before posting dogs, while adopters must share their address and contact information before they can interact with shelters.",
    },
    {
      id: "item-3",
      icon: "dog",
      question: "What information is required to post a dog?",
      answer:
        "Shelters can upload photos, a short description, the dog’s age, breed, health details, and even a short voice recording of the dog. This helps adopters understand the dog’s personality better.",
    },
    {
      id: "item-4",
      icon: "heart",
      question: "How does the matching process work?",
      answer:
        "Adopters can swipe through dog profiles and like the ones they are interested in. When they like a dog, the shelter receives a notification. If both sides agree, they can chat in the app and move forward with adoption.",
    },
    {
      id: "item-5",
      icon: "shield",
      question: "Is the adoption process safe?",
      answer:
        "Yes. We require both shelters and adopters to provide verification details to ensure trust and safety. Additionally, shelters and adopters can chat and confirm details before finalizing the adoption.",
    },
  ];

  return (
    <section className="dark:bg-background mx-auto max-w-5xl rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl font-bold">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mt-4">
                Can&#39;t find what you&#39;re looking for? Contact our{" "}
                <Link
                  href="#"
                  className="text-primary font-bold hover:underline"
                >
                  customer support team
                </Link>
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background rounded-lg border px-4 shadow-xs last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon
                          name={item.icon}
                          className="m-auto size-4"
                        />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
