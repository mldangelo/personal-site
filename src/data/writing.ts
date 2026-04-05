export interface WritingItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

/** External articles and posts (newest first). Add entries in src/data/writing.ts. */
const data: WritingItem[] = [];

export default data;
