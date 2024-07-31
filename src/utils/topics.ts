import type { Tables, Enums } from "@/types/supabase";

export const sourceToString = (source: Enums<"source">): string => {
  switch (source) {
    case "book":
      return "Livre";
    case "article":
      return "Article";
    case "podcast":
      return "Podcast";
    case "video":
      return "Vidéo";
    default:
      return "Par source";
  }
};

export function getTopicNameFromTopicSlug(topics: Tables<"topics">[], slug: string): string {
  const topic = topics.find((topic) => topic.slug === slug);
  return topic?.name as string;
}
