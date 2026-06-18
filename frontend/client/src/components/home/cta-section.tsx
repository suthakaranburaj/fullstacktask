'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { defaultTransition, scaleIn } from '@/lib/motion';

export function CtaSection() {
  return (
    <section id="cta" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={scaleIn}
          transition={defaultTransition}
          whileHover={{ scale: 1.01 }}
          className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 text-center shadow-sm sm:p-12"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your personal knowledge garden?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            Start capturing ideas today. Your notes stay organized, searchable, and easy to revisit
            whenever inspiration strikes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
