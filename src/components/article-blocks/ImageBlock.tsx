export function ImageBlock({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  if (!src) return null;
  return (
    <figure className="my-6">
      <img src={src} alt={alt} className="w-full h-auto rounded-md border border-border bg-muted/30" />
      {caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}
