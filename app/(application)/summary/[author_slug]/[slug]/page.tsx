import React from "react";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import AccountDropdown from "@/components/global/accountDropdown";
import TypographyH1 from "@/components/typography/h1";
import type { Summary } from "@/types/summary/summary";
import type { UserTopics } from "@/types/topics/topics";
import TypographySpan from "@/components/typography/span";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRightIcon, ClockIcon } from "lucide-react";

const summary: Summary = {
  id: 1,
  title: "The Lean Startup",
  author: "Eric Ries",
  image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  created_at: new Date(),
  slug: "the-lean-startup",
  author_slug: "eric-ries",
  topic: "Startups",
  source: "Livre",
  source_url: "https://example.com",
  reading_time: 10
};

const Page = async ({ params }: { params: { author_slug: string; slug: string } }) => {
  const { slug, author_slug } = params;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  const userMetadata = data.user.user_metadata;
  const userId = data.user.id as UUID;

  const { data: topics } = await supabase.from("topics").select("*");

  if (!topics) {
    redirect("/");
  }

  const { data: userTopics } = await supabase.from("user_topics").select("*").eq("user_id", userId);

  return (
    <>
      <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-6 md:gap-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <TypographySpan isPrimaryColor>{summary.topic}</TypographySpan>
                <TypographyH1>{summary.title}</TypographyH1>
                <TypographyH3AsSpan muted>Par {summary.author}</TypographyH3AsSpan>

                <div className="flex items-center">
                  <Badge>{summary.source}</Badge>
                  {summary.source_url && (
                    <Button variant="link" className="text-muted-foreground" asChild>
                      <Link href={summary.source_url} target="_blank">
                        Voir l&apos;original
                        <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>

                {summary.reading_time && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />{" "}
                    <TypographySpan muted>
                      Temps de lecture estimé: {summary.reading_time} minutes
                    </TypographySpan>
                  </div>
                )}
              </div>

              <AccountDropdown
                userMetadata={userMetadata}
                userId={userId}
                topics={topics}
                userTopics={userTopics as UserTopics}
              />
            </div>

            <div>
              <TypographySpan isDefaultColor>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec dui nec nunc
                consectetur lacinia. Integer sit amet nisl nec nisi ultricies ultricies. Nam
                sodales, nunc eget ultricies luctus, orci nunc ultricies metus, in ultricies justo
                justo ac nunc. Nullam nec dui nec nunc consectetur lacinia. Integer sit amet nisl
                nec nisi ultricies ultricies. Nam sodales, nunc eget ultricies luctus, orci nunc
                ultricies metus, in ultricies justo justo ac nunc.
              </TypographySpan>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
