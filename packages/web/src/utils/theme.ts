import type { Tables } from "@/types/supabase";

export const setIconColorFromTheme = (
  theme: string,
  topic: Tables<"topics">,
  invert: boolean
): string => {
  if (invert) {
    return theme === "dark" ? (topic.black_icon as string) : (topic.white_icon as string);
  } else {
    return theme === "dark" ? (topic.white_icon as string) : (topic.black_icon as string);
  }
};
