export function ParagraphBlock({ content }: { content?: string }) {
  if (!content) return null;
  return <p>{content}</p>;
}
