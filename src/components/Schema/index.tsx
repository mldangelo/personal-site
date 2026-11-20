/**
 * Renders an array of schema.org nodes as a single JSON-LD `@graph` document.
 * Nodes are merged by `@id`, so referencing shared entities (Person, WebSite)
 * keeps the markup DRY and lets crawlers build one knowledge graph.
 */
export function SchemaGraph({ nodes }: { nodes: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': nodes,
        }).replace(/</g, '\\u003c'),
      }}
    />
  );
}
