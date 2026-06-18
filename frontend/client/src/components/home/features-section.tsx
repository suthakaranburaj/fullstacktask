import { PencilLine, Search, ShieldCheck, Tags, Trash2, Zap } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: PencilLine,
    title: 'Create & edit easily',
    description: 'Write multiple notes with a clean editor and instant updates.',
  },
  {
    icon: Search,
    title: 'Powerful search',
    description: 'Find notes quickly by title or content — no more lost ideas.',
  },
  {
    icon: Tags,
    title: 'Stay organized',
    description: 'Use tags and previews to keep your workspace tidy and scannable.',
  },
  {
    icon: Zap,
    title: 'Fast & responsive',
    description: 'A smooth experience on desktop, tablet, and mobile.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    description: 'Built with authentication-ready architecture for your peace of mind.',
  },
  {
    icon: Trash2,
    title: 'Delete with confidence',
    description: 'Remove notes safely with clear confirmations before deletion.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-alt py-20 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to manage notes beautifully"
          description="Simple tools that help you capture, organize, and revisit your thoughts without friction."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" aria-hidden />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
