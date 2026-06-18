import Link from 'next/link';
import { homeNavLinks, siteConfig } from '@/constants/site';

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>

        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3" aria-label="Footer navigation">
          <div className="space-y-3">
            <p className="text-sm font-semibold">Explore</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {homeNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Support</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/maintenance" className="transition-colors hover:text-foreground">
                  Maintenance
                </Link>
              </li>
              <li>
                <Link href="/error/500" className="transition-colors hover:text-foreground">
                  Server status
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. Built with care for clear thinking.
      </div>
    </footer>
  );
}
