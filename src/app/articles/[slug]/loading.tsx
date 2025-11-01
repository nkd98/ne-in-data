import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl animate-pulse px-4 py-8 md:py-16">
      <header className="text-center">
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto mt-4 h-6 w-full" />
        <Skeleton className="mx-auto mt-2 h-6 w-4/5" />
        <div className="mt-8 flex items-center justify-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
      </header>

      <Skeleton className="mt-12 aspect-video w-full rounded-lg" />
      
      <div className="mt-12 space-y-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="mt-8 h-8 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/6" />
      </div>
    </div>
  );
}
