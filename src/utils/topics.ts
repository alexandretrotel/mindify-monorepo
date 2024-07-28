import type { Source } from "@/types/summary";

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
