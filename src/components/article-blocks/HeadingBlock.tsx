export function HeadingBlock({ type, content }: { type: 'h2' | 'h3', content?: string }) {
  if (!content) return null;

  if (type === 'h2') {
    return <h2>{content}</h2>;
  }
  
  return <h3>{content}</h3>;
}
