import Link from "next/link";
import { Logo } from "./logo";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-[60px] pb-[40px]">
      <div className="container mx-auto px-4 text-center text-sm font-body text-footer-text">
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-3">
          <span>© 2025 Northeast in Data</span>
          <span className="hidden md:inline">·</span>
          <Link href="/about" className="text-primary hover:underline">
            About
          </Link>
          <span className="hidden md:inline">·</span>
          <Link href="mailto:hello@northeastindata.com" className="text-primary hover:underline">
            Contact
          </Link>
          <span className="hidden md:inline">·</span>
          <a 
            href="https://www.buymeacoffee.com/yourhandle" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline"
            aria-label="Support Northeast in Data"
          >
            ☕ Support
          </a>
        </div>
        <p className="mt-4 text-xs">
          All content is open for reuse with attribution (CC BY 4.0 unless noted).
        </p>
      </div>
    </footer>
  );
}
