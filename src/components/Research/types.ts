// src/components/Research/types.ts

export interface CellData {
  title: string;
  link?: string;
  image: string;
  imageMobile?: string;
  desc?: string;
  papers: PaperData[];
}

export interface PaperLink {
  link: string;
  text?: string;
}

export interface PaperData {
  title: string;
  authors: string;
  journal?: string;
  year?: number;
  remark?: string;
  status?: string;
  links?: PaperLink[];
}
