import { personNode, websiteNode } from '@/lib/schema';
import SchemaGraph from './SchemaGraph';

/**
 * Site-wide structured data emitted from the root layout: the canonical
 * WebSite and Person nodes. Every route inherits these, and page-level graphs
 * reference them by `@id` rather than repeating their properties.
 */
export default function SiteSchema() {
  return <SchemaGraph nodes={[websiteNode(), personNode()]} />;
}
