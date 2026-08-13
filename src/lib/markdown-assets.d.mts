export interface MarkdownReference {
  kind: 'asset' | 'image' | 'link';
  target: string;
}

export function parseSrcset(value: string): string[];
export function readMarkdownReferences(markdown: string): MarkdownReference[];
export function readMarkdownImageSources(markdown: string): string[];
