import { buildGraph } from '@/lib/schema';
import JsonLd from './JsonLd';

interface SchemaGraphProps {
  nodes: Record<string, unknown>[];
}

/**
 * Renders an array of schema.org nodes as a single JSON-LD `@graph` document.
 * Nodes are merged by `@id`, so referencing shared entities (Person, WebSite)
 * keeps the markup DRY and lets crawlers build one knowledge graph.
 */
export default function SchemaGraph({ nodes }: SchemaGraphProps) {
  return <JsonLd data={buildGraph(nodes)} />;
}
