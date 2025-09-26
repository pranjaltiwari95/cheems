import { Card, CardContent } from "@/components/ui/card";
import { Dog, HeartHandshake, Home, MessagesSquare, Users } from "lucide-react";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            {/* Card 1: Swipe & Adopt */}
            <Card className="relative col-span-full flex flex-col justify-center overflow-hidden text-center lg:col-span-2">
              <CardContent className="pt-6">
                <HeartHandshake className="mx-auto size-12" />
                <h2 className="mt-6 text-3xl font-semibold">Swipe & Adopt</h2>
                <p className="text-foreground mt-2">
                  Find your new best friend with a simple swipe. Our fun,
                  Tinder-like interface makes adoption engaging and easy.
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Rich Dog Profiles */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6 text-center">
                <div className="relative mx-auto flex aspect-square size-32 items-center justify-center rounded-full border dark:border-white/10">
                  <Dog className="size-16" />
                </div>
                <div className="relative z-10 mt-6 space-y-2">
                  <h2 className="text-lg font-medium dark:text-white">
                    Rich Dog Profiles
                  </h2>
                  <p className="text-foreground">
                    See photos, read their story, and even hear their bark with
                    unique voice notes.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Verified Shelters */}
            <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
              <CardContent className="pt-6 text-center">
                <div className="relative mx-auto flex aspect-square size-32 items-center justify-center rounded-full border dark:border-white/10">
                  <Home className="size-16" />
                </div>
                <div className="relative z-10 mt-6 space-y-2">
                  <h2 className="text-lg font-medium transition">
                    Verified Shelters
                  </h2>
                  <p className="text-foreground">
                    We partner with trusted shelters across India, ensuring
                    every dog comes from a safe place.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Direct Chat */}
            <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
              <CardContent className="grid h-full items-center pt-6">
                <div className="relative z-10 flex flex-col justify-center space-y-6">
                  <div className="relative flex aspect-square size-12 items-center justify-center rounded-full border dark:border-white/10">
                    <MessagesSquare
                      className="m-auto size-5"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium text-zinc-800 dark:text-white">
                      Direct & Secure Chat
                    </h2>
                    <p className="text-foreground">
                      Once you match, connect directly with the shelter to ask
                      questions and arrange a meeting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 5: Join the Community */}
            <Card className="card variant-outlined relative col-span-full overflow-hidden lg:col-span-3">
              <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                  <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                    <Users className="m-auto size-6" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-medium transition">
                      A Community of Lovers
                    </h2>
                    <p className="text-foreground">
                      Join adopters and shelters working together to give every
                      dog a loving home.
                    </p>
                  </div>
                </div>
                <div className="relative mt-6 before:absolute before:inset-0 before:mx-auto before:w-px sm:-my-6 sm:-mr-6">
                  <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                    <div className="relative flex w-[calc(50%+2.5rem)] items-center justify-end gap-2">
                      <span className="bg-card block h-fit rounded border px-2 py-1 text-xs shadow-sm">
                        PAWS Shelter
                      </span>
                      <div className="ring-background bg-muted size-7 rounded-full ring-4"></div>
                    </div>
                    <div className="relative ml-[calc(50%-1.5rem)] flex items-center gap-2">
                      <div className="ring-background size-8 ring-4">
                        <Image
                          width={32}
                          height={32}
                          className="size-full rounded-full"
                          src="https://avatars.githubusercontent.com/u/47919550?v=4"
                          alt="Adopter avatar"
                        />
                      </div>
                      <span className="bg-card block h-fit rounded border px-2 py-1 text-xs shadow-sm">
                        Rohan S.
                      </span>
                    </div>
                    <div className="relative flex w-[calc(50%+2rem)] items-center justify-end gap-2">
                      <span className="bg-card block h-fit rounded border px-2 py-1 text-xs shadow-sm">
                        Priya K.
                      </span>
                      <div className="ring-background size-7 ring-4">
                        <Image
                          width={28}
                          height={28}
                          className="size-full rounded-full"
                          src="https://avatars.githubusercontent.com/u/31113941?v=4"
                          alt="Adopter avatar 2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
