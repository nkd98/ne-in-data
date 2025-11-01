export function IntroBlock({ content }: { content?: string }) {
    if (!content) return null;
    return <p className="lead text-xl text-muted-foreground">{content}</p>;
}
