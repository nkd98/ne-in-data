import { getVisualById } from "@/lib/data";
import { VisualCard } from "@/components/visual-card";

export function TableBlock({ visualId }: { visualId?: string }) {
    if (!visualId) return null;

    const visual = getVisualById(visualId);

    if (!visual) {
        return <div className="text-red-500">Table not found: {visualId}</div>
    }

    return (
        <div className="my-6">
            <VisualCard visual={visual} />
        </div>
    );
}
