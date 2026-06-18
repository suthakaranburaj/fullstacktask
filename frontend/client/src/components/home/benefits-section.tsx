import { SectionHeading } from '@/components/common/section-heading';

const stats = [
  { value: '10k+', label: 'Notes organized' },
  { value: '99.9%', label: 'Uptime mindset' },
  { value: '<1s', label: 'Search response' },
  { value: '24/7', label: 'Access anywhere' },
];

const benefits = [
  'Light and dark mode for comfortable reading any time of day',
  'Clean list view with previews, created date, and updated date',
  'Built for future collaboration with a scalable backend architecture',
  'Positive, distraction-free interface that keeps you motivated',
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="section-alt py-20 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why NoteNest"
          title="A brighter way to work with your thoughts"
          description="Designed to feel encouraging — because productivity should not feel stressful."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <ul className="mx-auto grid max-w-3xl gap-3 text-muted-foreground">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3 rounded-lg border bg-background px-4 py-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
