import React from "react";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import AccountDropdown from "@/components/global/accountDropdown";
import TypographyH1 from "@/components/typography/h1";
import type { Author, Authors, Summary } from "@/types/summary/summary";
import type { Topics } from "@/types/topics/topics";
import TypographySpan from "@/components/typography/span";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRightIcon, CheckIcon, ClockIcon, LibraryBigIcon } from "lucide-react";
import { sourceToString } from "@/utils/topics";
import TypographyH2 from "@/components/typography/h2";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const chapters = [
  {
    title: "Chapitre 1",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec dui nec nunc consectetur lacinia. Integer sit amet nisl nec nisi ultricies ultricies. Nam sodales, nunc eget ultricies luctus, orci nunc ultricies metus, in ultricies justo justo ac nunc. Nullam nec dui nec nunc consectetur lacinia. Integer sit amet nisl nec nisi ultricies ultricies. Nam sodales, nunc eget ultricies luctus, orci nunc ultricies metus, in ultricies justo justo ac nunc."
  },
  {
    title: "Chapitre 2",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec dui nec nunc consectetur lacinia. Integer sit amet nisl nec nisi ultricies ultricies. Nam sodales, nunc eget ultricies luctus, orci nunc ultricies metus, in ultricies justo justo ac nunc. Nullam nec dui nec nunc consectetur lacinia. Integer sit amet nisl nec nisi ultricies ultricies. Nam sodales, nunc eget ultricies luctus, orci nunc ultricies metus, in ultricies justo justo ac nunc."
  }
];

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

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics);

  const { data: authorsData } = await supabase.from("authors").select("*");
  const authors: Authors = authorsData as Authors;
  const author: Author = authors.find((author) => author.slug === author_slug) as Author;

  const { data: summaryData } = await supabase
    .from("summaries")
    .select("*")
    .eq("slug", slug)
    .single();
  const summary = {
    ...summaryData,
    topic: topics?.find((topic) => topic.id === summaryData.topic_id)?.name
  } as Summary;

  const isSummarySaved: boolean = false;
  const isSummaryRead: boolean = false;
  const summaryReads: number = 87;

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-6 md:gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <TypographySpan isPrimaryColor>
                  {summary.topic} • {sourceToString(summary.source_type)}
                </TypographySpan>
                <TypographyH1>{summary.title}</TypographyH1>
                <TypographyH3AsSpan muted>Par {author.name}</TypographyH3AsSpan>
              </div>

              <AccountDropdown
                userMetadata={userMetadata}
                userId={userId}
                topics={topics}
                userTopics={userTopics as Topics}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {isSummarySaved ? (
                  <Button variant="default" size="sm" className="flex items-center gap-2">
                    Enregistré <CheckIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <LibraryBigIcon className="h-4 w-4" />
                    Ajouter à ma bibliothèque
                  </Button>
                )}

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
                    Temps de lecture : {summary.reading_time} minutes
                  </TypographySpan>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:gap-16">
            <div className="order-2 flex max-w-3xl flex-col gap-8 lg:order-1 lg:min-w-0 lg:grow">
              <div className="flex flex-col gap-4">
                <TypographyH2>Introduction</TypographyH2>
                <TypographySpan isDefaultColor>{summary.introduction}</TypographySpan>
              </div>

              <div className="flex flex-col gap-8">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.title}
                    id={"chapter" + String(index + 1)}
                    className="flex flex-col gap-4"
                  >
                    <TypographyH2>{chapter.title}</TypographyH2>
                    <TypographySpan isDefaultColor>{chapter.text}</TypographySpan>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <TypographyH2>Conclusion</TypographyH2>
                <TypographySpan isDefaultColor>{summary.conclusion}</TypographySpan>
              </div>

              <div className="flex flex-col gap-4">
                <div className="w-full md:w-fit">
                  {isSummaryRead ? (
                    <Button variant="default" className="flex items-center gap-2">
                      Déjà lu <CheckIcon className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex items-center gap-2">
                      Fini de lire ?
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="order-1 flex w-full flex-col gap-8 lg:order-2">
              <Card>
                <CardHeader>
                  <TypographyH3AsSpan>Table des matières</TypographyH3AsSpan>
                </CardHeader>

                <CardContent>
                  <ul className="flex flex-col gap-2">
                    {chapters.map((chapter, index) => (
                      <li key={chapter.title}>
                        <Link
                          href={`#${"chapter" + String(index + 1)}`}
                          className="text-sm text-muted-foreground hover:underline"
                        >
                          {chapter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <TypographyH3AsSpan>À propos de l&apos;auteur</TypographyH3AsSpan>
                </CardHeader>

                <CardContent>
                  <TypographySpan isDefaultColor>
                    {author.description ?? "Aucune description disponible."}
                  </TypographySpan>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
