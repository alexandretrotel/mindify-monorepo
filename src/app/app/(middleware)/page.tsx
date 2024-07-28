import { createClient } from "@/utils/supabase/server";
import Application from "@/app/app/(middleware)/components/Application";
import type { Topics } from "@/types/topics";
import type { Authors, Summaries } from "@/types/summary";
import type { UserReads, UserLibrary } from "@/types/user";
import AccountDropdown from "@/components/global/AccountDropdown";

export default async function Home() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  const { data: topics } = await supabase.from("topics").select("*");

  const { data: authorData } = await supabase.from("authors").select("*");
  const authors = authorData as Authors;

  const { data: userReadsData } = await supabase.from("user_reads").select("*");
  const userReads: UserReads = userReadsData?.filter(
    (read) => read.user_id === data?.user?.id
  ) as UserReads;

  const { data: summariesData } = await supabase.from("summaries").select("*");
  const summaries: Summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topics?.find((topic) => topic.id === summary.topic_id)?.name,
    author_slug: authors?.find((author) => author.id === summary.author_id)?.slug,
    number_of_reads: userReads?.filter((read) => read.summary_id === summary.id).length
  })) as Summaries;

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", data?.user?.id);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics) as Topics;

  const { data: userLibraryData } = await supabase
    .from("user_library")
    .select("*")
    .eq("user_id", data?.user?.id);
  const userLibrary: UserLibrary = userLibraryData as UserLibrary;

  return (
    <Application
      topics={topics as Topics}
      userTopics={userTopics}
      summaries={summaries}
      userReads={userReads}
      authors={authors}
      userLibrary={userLibrary}
    >
      <AccountDropdown />
    </Application>
  );
}
