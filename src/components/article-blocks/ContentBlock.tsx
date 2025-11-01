export function ContentBlock({ title, content }: { title: string, content?: string }) {
  if (!content) return null;

  return (
    <section className="my-6">
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
}
