import Header from "@/components/home/header";
import Hero from "@/components/home/hero";
import Faq from "@/components/home/faq";
import Testimonials from "@/components/home/testimonials";
import Pricing from "@/components/home/pricing";
import { createClient } from "@/utils/supabase/server";
import Application from "@/components/application/application";
import Footer from "@/components/home/footer";
import type { Topics } from "@/types/topics/topics";
import { UUID } from "crypto";
import type { Authors, Summaries } from "@/types/summary/summary";
import type { UserReads, UserSummaryStatuses } from "@/types/user";

export default async function Home() {
  const supabase = createClient();

  const { data: topics } = await supabase.from("topics").select("*");
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <Hero topics={topics as Topics} />
          <Testimonials />
          <Pricing />
          <Faq />
        </main>
        <Footer />
      </>
    );
  }

  const { data: authorData } = await supabase.from("authors").select("*");
  const authors = authorData as Authors;

  const { data: userReadsData } = await supabase.from("user_reads").select("*");
  const userReads: UserReads = userReadsData?.filter(
    (read) => read.user_id === data.user.id
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
    .eq("user_id", data.user.id);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics) as Topics;

  const { data: userSummaryStatusesData } = await supabase
    .from("user_summary_statuses")
    .select("*")
    .eq("user_id", data.user.id);
  const userSummaryStatuses: UserSummaryStatuses = userSummaryStatusesData as UserSummaryStatuses;

  return (
    <Application
      userId={data.user.id as UUID}
      userMetadata={data.user.user_metadata}
      topics={topics as Topics}
      userTopics={userTopics}
      summaries={summaries}
      userReads={userReads}
      authors={authors}
      userSummaryStatuses={userSummaryStatuses}
    />
  );
}
