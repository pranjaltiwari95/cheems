import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Ananya Sharma",
    role: "Dog Adopter",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    quote:
      "Cheems made adopting my first dog so simple and heartwarming. I found Bruno’s profile, connected with the shelter instantly, and within a week he was home with me. Truly life-changing!",
  },
  {
    name: "Rahul Verma",
    role: "Shelter Owner - Paws Care",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    quote:
      "We’ve been able to connect our rescued dogs with loving families faster than ever before. Cheems is the bridge we always needed between shelters and adopters.",
  },
  {
    name: "Sanya Kapoor",
    role: "Volunteer",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    quote:
      "Cheems is more than an app — it’s a community. Helping shelters and adopters connect directly means more dogs get the second chance they deserve.",
  },
  {
    name: "Vikram Singh",
    role: "First-time Adopter",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    quote:
      "I was nervous about adopting, but Cheems made it feel safe and trustworthy. The chat feature with shelters gave me all the confidence I needed.",
  },
  {
    name: "Meera Patel",
    role: "Rescue Worker",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    quote:
      "Through Cheems, we’ve successfully rehomed dozens of stray dogs. The platform is intuitive, secure, and gives every pup the spotlight they deserve.",
  },
  {
    name: "Aarav Khanna",
    role: "Dog Lover & Adopter",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    quote:
      "Cheems feels like Tinder for dogs — I browsed profiles, liked Max, and soon enough I was his new human. Smooth, fun, and meaningful.",
  },
  {
    name: "Pooja Nair",
    role: "Shelter Volunteer",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    quote:
      "The way Cheems highlights each dog’s personality with photos and even their voice recordings makes adoption feel so personal and real.",
  },
  {
    name: "Karan Malhotra",
    role: "Repeat Adopter",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    quote:
      "I’ve adopted two dogs using Cheems. The process is transparent, and shelters are responsive. I recommend it to anyone looking to adopt responsibly.",
  },
  {
    name: "Divya Joshi",
    role: "Animal Rights Activist",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    quote:
      "Cheems is revolutionizing adoption in India. By giving shelters a modern tool, more strays find loving homes instead of living on the streets.",
  },
  {
    name: "Aditya Rao",
    role: "Dog Trainer",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote:
      "I’ve seen so many happy matches through Cheems. It’s practical for adopters, empowering for shelters, and a blessing for the dogs.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export default function TestimonialSection() {
  return (
    <section>
      <div className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Loved by the Community</h2>
            <p className="mt-6">
              Harum quae dolore orrupti aut temporibus ariatur.
            </p>
          </div>
          <div className="mt-8 grid gap-3 [--color-card:var(--color-muted)] sm:grid-cols-2 md:mt-12 lg:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
            {testimonialChunks.map((chunk, chunkIndex) => (
              <div
                key={chunkIndex}
                className="space-y-3 *:border-none *:shadow-none"
              >
                {chunk.map(({ name, role, quote, image }, index) => (
                  <Card key={index}>
                    <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                      <Avatar className="size-9">
                        <AvatarImage
                          alt={name}
                          src={image}
                          loading="lazy"
                          width="120"
                          height="120"
                        />
                        <AvatarFallback>ST</AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-medium">{name}</h3>

                        <span className="text-muted-foreground block text-sm tracking-wide">
                          {role}
                        </span>

                        <blockquote className="mt-3">
                          <p className="text-gray-700 dark:text-gray-300">
                            {quote}
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
