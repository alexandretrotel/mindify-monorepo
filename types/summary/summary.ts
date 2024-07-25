export type Source = "book" | "article" | "podcast" | "video";

export type Sources = Source[];

export type Summary = {
  id: number;
  title: string;
  slug: string;
  author: string;
  topic_id: number;
  topic: string;
  author_id: number;
  author_slug: string;
  source_type: Source;
  introduction: string;
  conclusion: string;
  source_url?: string;
  image_url?: string;
  reading_time: number;
  number_of_reads?: number;
  created_at: Date;
};

export type Summaries = Summary[];

export type Author = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
};

export type Authors = Author[];

export type SummaryChapter = {
  id: number;
  summary_id: number;
  title: string;
  text: string;
  created_at: Date;
};

export type SummaryChapters = SummaryChapter[];
