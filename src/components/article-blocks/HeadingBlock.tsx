export function HeadingBlock({ type, content }: { type: 'h2' | 'h3', content?: string }) {
  if (!content) return null;

  if (type === 'h2') {
    return (
      <h2 className="border-b border-primary/30 pb-2 text-xl font-display font-semibold tracking-tight text-foreground md:text-2xl">
        <span className="text-primary">{content}</span>
      </h2>
    );
  }
  
  return (
    <h3 className="text-lg font-display font-semibold tracking-tight text-foreground/90 md:text-xl">
      <span className="text-primary/80">{content}</span>
    </h3>
  );
}
