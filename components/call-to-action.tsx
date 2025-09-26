import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
            Adopt a Cheems
          </h2>
          <p className="mt-4">Find a Furry Friend Cheems with Cheems</p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-xl px-5 text-base">
              <Link href="/dashboard">
                <span className="text-nowrap">Adopt a Cheems</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
