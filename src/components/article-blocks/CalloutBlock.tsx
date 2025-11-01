import { Info } from "lucide-react";

export function CalloutBlock({ content }: { content?: string }) {
  if (!content) return null;

  return (
    <div className="my-6 rounded-lg border border-l-4 border-primary bg-accent p-4 text-accent-foreground">
      <div className="flex items-start gap-4">
        <Info className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
        <p className="m-0 font-medium">{content}</p>
      </div>
    </div>
  );
}
