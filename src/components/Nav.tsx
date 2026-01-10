'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { Logo } from './logo';
import React from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/topics', label: 'Topics' },
  { href: '/articles', label: 'Insights' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const isLinkActive = (link: {href: string}) => {
    if (link.href === '/about') {
        return pathname.startsWith('/about');
    }
    return pathname === link.href;
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map(link => (
                 <Link 
                    key={link.href} 
                    href={link.href} 
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        isLinkActive(link) ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {link.label}
                 </Link>
              ))}
            </nav>
        </div>
        <div className="flex items-center gap-2">
            <div className="md:hidden">
              {isClient && (
                  <Sheet>
                      <SheetTrigger asChild>
                          <Button variant="outline" size="icon">
                              <Menu className="h-4 w-4" />
                          </Button>
                      </SheetTrigger>
                      <SheetContent>
                          <SheetTitle className="sr-only">Navigation</SheetTitle>
                          <nav className="mt-8 flex flex-col gap-4">
                              {navLinks.map(link => (
                                  <Link
                                      key={link.href}
                                      href={link.href}
                                      className={cn(
                                          "text-lg font-medium transition-colors hover:text-primary",
                                          isLinkActive(link) ? "text-primary" : "text-foreground"
                                      )}
                                  >
                                      {link.label}
                                  </Link>
                              ))}
                          </nav>
                      </SheetContent>
                  </Sheet>
              )}
            </div>
        </div>
      </div>
    </header>
  );
}
