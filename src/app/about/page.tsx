export default function AboutPage() {
  return (
    <div className="prose prose-lg mx-auto max-w-none dark:prose-invert lg:prose-xl prose-p:font-body prose-headings:font-display">
      <p>
        Northeast in Data is an independent initiative that uses evidence to
        understand the region, its people, society, and economy. We turn
        public data into clear, visual explanations so complex issues are
        easier to see and discuss.
      </p>
      <p>
        Our work focuses on questions that shape everyday life in the
        Northeast — how people work, move, learn, and adapt. Each piece is
        built from reliable, open sources and presented with context and
        transparency.
      </p>
      <p>
        The goal is simple: bring clarity to the region through data, and
        support more informed conversation and decision-making.
      </p>


      <h2 className="mt-16">How to use this site</h2>
      <ul>
        <li>Explore topic pages to read concise, visual explainers.</li>
        <li>
          Open the underlying data where available, and trace sources from
          the “Source” lines under charts.
        </li>
        <li>Share or cite charts with attribution to Northeast in Data.</li>
      </ul>

      <h2 className="mt-16">Reuse & citation</h2>
      <p>
        You’re welcome to share our charts with attribution. Suggested
        citation:
      </p>
      <blockquote className="border-l-4 border-primary bg-muted/50 p-4 not-italic">
        Northeast in Data. (Year). Article Title. Retrieved from URL (Accessed: Month Day, Year).
      </blockquote>

      <h2 className="mt-16">Support the project</h2>
      <p>
          If our work helps you, consider citing it, sharing it with others, or acknowledging it in your writing. Every mention helps keep open, data-driven work from the Northeast visible.
      </p>

      <h2 className="mt-16">Collaborate</h2>
      <p>
          We welcome partnerships, ideas, and datasets that deepen understanding of the Northeast. If you’d like to collaborate — through research, design, or data — write to <a href="mailto:hello@northeastindata.com" className="text-primary hover:underline">hello@northeastindata.com</a>.
      </p>


      <h2 className="mt-16">Contact</h2>
      <p>
        Questions, feedback, or corrections:{" "}
        <a href="mailto:hello@northeastindata.com" className="text-primary hover:underline">
          hello@northeastindata.com
        </a>
      </p>
    </div>
  );
}
