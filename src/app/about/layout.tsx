'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const aboutTabs = [
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
];

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <nav
          role="tablist"
          aria-label="About pages"
          className="mb-8 border-b"
        >
          <div className="flex gap-8">
            {aboutTabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    'relative pb-3 text-base font-semibold transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <main>{children}</main>
      </div>
    </div>
  );
}
