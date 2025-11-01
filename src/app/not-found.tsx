import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16 text-center">
      <div>
        <p className="text-2xl font-semibold text-primary">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
