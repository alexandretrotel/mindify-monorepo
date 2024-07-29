import type { Source } from "@/types/summary";
import type { Topic, Topics } from "@/types/topics";

export const sourceToString = (source: Source): string => {
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

export function getTopicNameFromTopicSlug(topics: Topics, slug: string): string {
  const topic = topics.find((topic) => topic.slug === slug) as Topic;
  return topic?.name;
}
