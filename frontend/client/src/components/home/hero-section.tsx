'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { siteConfig } from '@/constants/site';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { defaultTransition, fadeUp, slideInRight } from '@/lib/motion';

export function HeroSection() {
  return (
    <section className="hero-gradient border-b">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={defaultTransition}
          className="space-y-6"
        >
          <Badge variant="accent" className="w-fit">
            <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden />
            Your calm space for ideas
          </Badge>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Notes that feel <span className="text-primary">light</span>, organized, and always within reach
          </h1>

          <p className="max-w-xl text-balance text-lg text-muted-foreground">{siteConfig.tagline}</p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">See features</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={slideInRight}
          transition={{ ...defaultTransition, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="rounded-2xl border bg-card p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Today&apos;s notes</p>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                3 active
              </span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Project kickoff ideas', preview: 'Define MVP scope and milestones...' },
                { title: 'Weekly reflection', preview: 'What went well this week...' },
                { title: 'Reading list', preview: 'Books to revisit in March...' },
              ].map((note, index) => (
                <motion.div
                  key={note.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.08, duration: 0.4 }}
                  className="rounded-lg border bg-background p-4"
                >
                  <p className="font-medium">{note.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{note.preview}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-2 -top-3 hidden rounded-xl border bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-md sm:block"
          >
            ✨ Auto-saved
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
