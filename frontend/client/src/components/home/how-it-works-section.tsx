import { SectionHeading } from '@/components/common/section-heading';

const steps = [
  {
    step: '01',
    title: 'Sign in with Google',
    description: 'Jump in quickly with a secure one-click login experience.',
  },
  {
    step: '02',
    title: 'Create your notes',
    description: 'Add titles, content, and tags — your workspace grows with you.',
  },
  {
    step: '03',
    title: 'Search & refine',
    description: 'Filter through notes instantly and keep only what matters in focus.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From blank page to organized clarity in minutes"
          description="NoteNest keeps the flow simple so you can spend more time thinking and less time managing."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
