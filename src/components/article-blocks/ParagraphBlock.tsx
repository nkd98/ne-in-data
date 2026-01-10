export function ParagraphBlock({ content }: { content?: string }) {
  if (!content) return null;
  const hasEmphasis = content.includes('<em>') && content.includes('</em>');
  if (!hasEmphasis) return <p>{content}</p>;

  const parts: Array<string | JSX.Element> = [];
  const emRegex = /<em>(.*?)<\/em>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = emRegex.exec(content)) !== null) {
    const start = match.index;
    if (start > lastIndex) {
      parts.push(content.slice(lastIndex, start));
    }
    parts.push(<em key={`em-${start}`}>{match[1]}</em>);
    lastIndex = start + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return <p>{parts}</p>;
}
