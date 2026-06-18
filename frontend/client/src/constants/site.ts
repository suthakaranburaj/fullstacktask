export const siteConfig = {
  name: 'NoteNest',
  tagline: 'Capture ideas. Stay organized. Think clearly.',
  description:
    'A warm and welcoming notes app to create, search, and manage your thoughts — built for calm productivity.',
  url: 'http://localhost:3000',
  links: {
    github: 'https://github.com',
    docs: '#features',
  },
} as const;

export const homeNavLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Why NoteNest', href: '#benefits' },
  { label: 'Get started', href: '#cta' },
] as const;
