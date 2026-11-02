import { buildGraph, personNode, websiteNode } from '@/lib/schema';

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
        __html: JSON.stringify(buildGraph(nodes)).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/**
 * Site-wide structured data emitted from the root layout: the canonical
 * WebSite and Person nodes. Every route inherits these, and page-level graphs
 * reference them by `@id` rather than repeating their properties.
 */
export function SiteSchema() {
  return <SchemaGraph nodes={[websiteNode(), personNode()]} />;
}
