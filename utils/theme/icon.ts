import { Topic } from "@/types/topics/topics";

export const setIconColorFromTheme = (theme: string, topic: Topic, invert: boolean): string => {
  if (invert) {
    return theme === "dark" ? (topic.black_icon as string) : (topic.white_icon as string);
  } else {
    return theme === "dark" ? (topic.white_icon as string) : (topic.black_icon as string);
  }
};
