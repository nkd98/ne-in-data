import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("text-lg font-bold", className)}>
      <span className="font-display">Northeast in Data</span>
    </Link>
  );
}
