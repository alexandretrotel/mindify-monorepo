import AccountDropdown from "@/components/global/accountDropdown";
import BookCover from "@/components/global/bookCover";
import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyH4AsSpan from "@/components/typography/h4AsSpan";
import TypographyP from "@/components/typography/p";
import TypographySpan from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Summaries } from "@/types/summary/summary";
import type { Topics } from "@/types/topics/topics";
import type { UserLibrary, UserReads } from "@/types/user";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import CopyProfileLinkButton from "@/app/app/(middleware)/profile/components/buttons/copyProfileLink";
import { isFriend } from "@/actions/friends";
import Friendship from "@/app/app/(middleware)/profile/components/buttons/friendship";
import MyFriends from "@/app/app/(middleware)/profile/components/myFriends";
import Friends from "@/app/app/(middleware)/profile/components/friends";
import ReadingStreak from "@/app/app/(middleware)/profile/components/readingStreak";

const Page = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  let profileId: UUID = searchParams.profileId as UUID;

  const { data: profileData } = await supabaseAdmin.auth.admin.getUserById(profileId);
  let profileMetadata: UserMetadata = profileData?.user?.user_metadata as UserMetadata;

  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const userId: UUID = userData?.user?.id as UUID;
  const userMetadata: UserMetadata = userData?.user?.user_metadata as UserMetadata;

  if (profileId === userId) {
    redirect("/app/profile");
  }

  let isMyProfile = false;
  if (!profileId) {
    isMyProfile = true;
    profileId = userId;
    profileMetadata = userMetadata;
  }

  const isMyFriend = await isFriend({ userId, profileId });

  const { data: topicsData } = await supabase.from("topics").select("*");
  const topics: Topics = topicsData as Topics;

  const { data: profileReadsData } = await supabase
    .from("user_reads")
    .select("*")
    .eq("user_id", profileId);
  const profileReads: UserReads = profileReadsData as UserReads;

  const { data: profileLibraryData } = await supabase
    .from("user_library")
    .select("*")
    .eq("user_id", profileId);
  const profileLibrary: UserLibrary = profileLibraryData as UserLibrary;

  const readSummaryIds = profileReads?.map((profileRead) => profileRead.summary_id) ?? [];
  const savedSummaryIds = profileLibrary?.map((profileLibrary) => profileLibrary.summary_id) ?? [];

  const { data: summariesData } = await supabase.from("summaries").select("*");
  const summaries: Summaries = summariesData?.map((summary) => ({
    ...summary,
    topic: topics?.find((topic) => topic.id === summary.topic_id)?.name
  })) as Summaries;

  const profileReadsSummaries = summaries?.filter((summary) => readSummaryIds.includes(summary.id));
  const profileLibrarySummaries = summaries?.filter((summary) =>
    savedSummaryIds.includes(summary.id)
  );

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 md:gap-8">
      <div className="flex w-full items-start justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            {isMyProfile && (
              <TypographySpan size="sm" muted semibold>
                Standard
              </TypographySpan>
            )}

            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={profileMetadata?.avatar_url} alt={profileMetadata?.name} />
                <AvatarFallback>
                  {profileMetadata?.name ? profileMetadata?.name ? profileMetadata?.name?.charAt(0) : "J" : "J"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <TypographyH4AsSpan>{profileMetadata?.name}</TypographyH4AsSpan>
                  <ReadingStreak profileId={profileId} />
                </div>
                <TypographyP size="sm" muted>
                  {profileMetadata?.biography ?? "Aucune biographie"}
                </TypographyP>
              </div>
            </div>
          </div>
        </div>

        <AccountDropdown
          userMetadata={userMetadata}
          userId={userId}
          topics={topics}
          userTopics={[]}
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-4">
        {!isMyProfile ? (
          <>
            <Friendship userId={userId} profileId={profileId} />

            {isMyFriend && (
              <Button size="sm" variant="destructive">
                Bloquer
              </Button>
            )}
          </>
        ) : (
          <>
            <Button size="sm" disabled>
              Modifier le profil
            </Button>

            <CopyProfileLinkButton userId={userId} />
          </>
        )}
      </div>

      <Separator />

      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex max-w-2xl flex-col gap-8 lg:min-w-0 lg:grow">
          <Tabs defaultValue="reads">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-8">
                <TabsList>
                  <TabsTrigger value="reads">Résumés lus</TabsTrigger>
                  <TabsTrigger value="saved">Enregistrés</TabsTrigger>
                </TabsList>

                {profileReadsSummaries?.length > 0 ||
                  (profileLibrarySummaries?.length > 0 && (
                    <Button variant="outline" asChild>
                      <Link
                        href={`/app/profile/${profileId}/summaries`}
                        className="flex items-center"
                      >
                        Voir tout
                      </Link>
                    </Button>
                  ))}
              </div>

              <TabsContent value="reads" className="w-full">
                <Carousel
                  opts={{
                    align: "start",
                    slidesToScroll: "auto"
                  }}
                  className="w-full"
                >
                  {profileReadsSummaries.length > 0 ? (
                    <CarouselContent className="-ml-4">
                      {profileReadsSummaries?.map((summary) => {
                        return (
                          <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                            <Link
                              href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                              className="h-full"
                            >
                              <BookCover
                                title={summary.title}
                                author={summary.author}
                                category={summary.topic}
                                source={summary.source_type}
                              />
                            </Link>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  ) : (
                    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                      <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
                    </div>
                  )}
                </Carousel>
              </TabsContent>

              <TabsContent value="saved">
                <Carousel opts={{ align: "start", slidesToScroll: "auto" }} className="w-full">
                  {profileLibrarySummaries.length > 0 ? (
                    <CarouselContent className="-ml-4">
                      {profileLibrarySummaries?.map((summary) => {
                        return (
                          <CarouselItem key={summary.id} className="basis-1/2 pl-4 md:basis-1/3">
                            <Link
                              href={`/app/summary/${summary.author_slug}/${summary.slug}`}
                              className="h-full"
                            >
                              <BookCover
                                title={summary.title}
                                author={summary.author}
                                category={summary.topic}
                                source={summary.source_type}
                              />
                            </Link>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  ) : (
                    <div className="flex h-96 flex-col items-center justify-center gap-4 text-center">
                      <TypographyH3AsSpan>Aucun résumé</TypographyH3AsSpan>
                    </div>
                  )}
                </Carousel>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex w-full flex-col gap-8 lg:max-w-md">
          {isMyProfile ? (
            <MyFriends userId={userId} />
          ) : (
            <Friends profileId={profileId} profileMetadata={profileMetadata} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
