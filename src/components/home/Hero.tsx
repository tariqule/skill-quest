import { HeroParticles } from "@/components/particles";
import { BookOpen, CalendarCheck, RotateCcw } from "lucide-react";

const POINTS = [
  { icon: BookOpen, text: "Short lessons you read first, then practise" },
  { icon: RotateCcw, text: "Reviews timed so you remember it" },
  { icon: CalendarCheck, text: "A few minutes a day, planned to your date" },
] as const;

/**
 * Calm home hero. Only a faint particle drift behind it, and no button of its own: below it sits the single
 * primary action (the plan wizard, or Today's Continue once a plan exists).
 * `compact` is the returning-learner version: a short greeting so Today comes first.
 */
export function Hero({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <section aria-label="Welcome">
        <h1 className="font-heading text-h2 font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1 text-base text-muted-foreground">Here&apos;s today&apos;s plan. Review comes first, it&apos;s what makes learning stick.</p>
      </section>
    );
  }
  return (
    <section aria-labelledby="hero-h" className="relative isolate max-w-3xl">
      {/* Decorative drift behind the first-visit hero only; lazy chunk, still under reduced motion. */}
      <HeroParticles className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 size-[calc(100%+3rem)] opacity-70 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_75%)]" />
      <h1 id="hero-h" className="font-heading text-h2 font-semibold tracking-tight text-foreground sm:text-h1">
        Learn tech skills, one small step at a time.
      </h1>
      <p className="mt-3 max-w-[65ch] text-body text-muted-foreground">
        Tell us what you&apos;re working towards and how much you already know. New to it? We start from zero. Preparing for an exam or interview? We plan your days.
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-4">
        {POINTS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-2 text-sm text-foreground/90">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}
