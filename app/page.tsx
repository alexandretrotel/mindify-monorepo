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

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", data.user.id);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics) as Topics;

  return (
    <Application
      userId={data.user.id as UUID}
      userMetadata={data.user.user_metadata}
      topics={topics as Topics}
      userTopics={userTopics}
    />
  );
}
