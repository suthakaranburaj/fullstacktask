'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/common/section-heading';
import { defaultTransition, fadeUp, staggerContainer } from '@/lib/motion';

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
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          transition={defaultTransition}
        >
          <SectionHeading
            eyebrow="How it works"
            title="From blank page to organized clarity in minutes"
            description="NoteNest keeps the flow simple so you can spend more time thinking and less time managing."
          />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-6 md:grid-cols-3"
        >
          {steps.map((item) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              transition={defaultTransition}
              whileHover={{ y: -4 }}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-primary">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
