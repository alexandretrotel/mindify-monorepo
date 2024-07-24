export type Source = "Livre" | "Article" | "Podcast" | "Vidéo";

export type Summary = {
  id: number;
  title: string;
  author: string;
  image: string;
  created_at: Date;
  slug: string;
  author_slug: string;
  topic: string;
  source: Source;
  source_url?: string;
  reading_time?: number;
};

export type Summaries = Summary[];
