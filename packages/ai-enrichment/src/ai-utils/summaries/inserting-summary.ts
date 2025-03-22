import { toSlug } from "@/utils/string";
import { supabaseAdmin } from "@/utils/supabase";

type Source = "book" | "article" | "video" | "podcast" | null;

export async function insertingSummary(
  title: string,
  topicId: number | null,
  authorId: number | undefined,
  chaptersId: number | undefined,
  source: Source,
  readingTime: number
) {
  if (!topicId || !authorId || !chaptersId || !source) {
    throw new Error("Missing required data for inserting summary");
  }

  const summaryTitleSlug = toSlug(title);

  const { data: summaryData, error: summaryError } = await supabaseAdmin
    .from("summaries")
    .insert({
      title: title,
      slug: summaryTitleSlug,
      topic_id: topicId,
      author_id: authorId,
      chapters_id: chaptersId,
      source_type: source,
      reading_time: readingTime,
      mindify_ai: true,
    })
    .select()
    .maybeSingle();

  if (summaryError) {
    throw summaryError;
  }

  return summaryData;
}
