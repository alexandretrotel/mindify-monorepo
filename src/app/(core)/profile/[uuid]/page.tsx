import H4Span from "@/components/typography/h4AsSpan";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import React, { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import Friendship from "@/components/features/profile/header/Friendship";
import Friends from "@/components/features/profile/friends/Friends";
import ReadingStreak from "@/components/features/profile/header/ReadingStreak";
import LibrarySnippet from "@/components/features/profile/summaries/LibrarySnippet";
import LibrarySnippetSkeleton from "@/components/features/profile/summaries/skeleton/LibrarySnippetSkeleton";
import FriendsSkeleton from "@/components/features/profile/friends/skeleton/FriendsSkeleton";
import { getUserCustomAvatarFromUserId } from "@/actions/users";
import { Muted } from "@/components/typography/muted";
import ProfileMinds from "@/components/features/profile/minds/ProfileMinds";
import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";
import { Carousel } from "@/components/ui/carousel";
import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Statistics from "@/components/features/my-statistics/Statistics";
import StatisticsSkeleton from "@/components/features/my-statistics/skeleton/StatisticsSkeleton";
import CopyProfileLink from "@/components/features/profile/header/CopyProfileLink";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { uuid: UUID } }): Promise<Metadata> {
  const profileId = params.uuid;

  const supabaseAdmin = createAdminClient();

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profileId);

  return {
    title: `${userData?.user?.user_metadata?.name} | Mindify`,
    openGraph: {
      title: `${userData?.user?.user_metadata?.name} | Mindify`,
      description: userData?.user?.user_metadata?.biography?.slice(0, 200),
      images: [
        {
          url:
            (await getUserCustomAvatarFromUserId(userData?.user?.id as UUID)) ??
            "/open-graph/og-image.png"
        }
      ],
      siteName: "Mindify",
      url: `https://mindify.fr/profile/${profileId}`
    },
    twitter: {
      title: `${userData?.user?.user_metadata?.name} | Mindify`,
      card: "summary_large_image",
      description: userData?.user?.user_metadata?.biography?.slice(0, 200),
      images: [
        {
          url:
            (await getUserCustomAvatarFromUserId(userData?.user?.id as UUID)) ??
            "/open-graph/og-image.png"
        }
      ]
    }
  };
}

const Page = async ({ params }: { params: { uuid: UUID } }) => {
  const profileId = params.uuid;

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isConnected = !!user;

  const supabaseAdmin = createAdminClient();

  const { data: profileData } = await supabaseAdmin.auth.admin.getUserById(profileId);
  let profileMetadata: UserMetadata = profileData?.user?.user_metadata as UserMetadata;

  const userId = user?.id as UUID;

  const isMyProfile = userId === profileId;

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4">
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="flex flex-col">
                <H4Span>
                  <div className="flex">
                    {profileMetadata?.name} <ReadingStreak profileId={profileId} />
                  </div>
                </H4Span>

                <Muted size="sm">{profileMetadata?.biography ?? "Aucune biographie"}</Muted>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:flex md:items-center">
        {isConnected && (
          <React.Fragment>
            {!isMyProfile && profileId ? (
              <Friendship userId={userId} profileId={profileId} size="sm" />
            ) : (
              <Button size="sm" disabled asChild>
                <Link href="/my-account">Modifier mon profil</Link>
              </Button>
            )}
          </React.Fragment>
        )}

        <CopyProfileLink userId={profileId} />
      </div>

      <Separator />

      <Tabs defaultValue="summaries" className="flex flex-col gap-8">
        <div className="flex w-full flex-wrap items-center gap-4">
          <TabsList>
            <TabsTrigger value="summaries">Résumés</TabsTrigger>
            <TabsTrigger value="minds">MINDS</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="friends">Amis</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-8 lg:gap-16">
            <TabsContent value="summaries">
              <Suspense fallback={<LibrarySnippetSkeleton />}>
                <LibrarySnippet profileId={profileId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="minds">
              <Suspense
                fallback={
                  <Carousel>
                    <MindsSkeleton />
                  </Carousel>
                }
              >
                <ProfileMinds profileId={profileId} userId={userId} isConnected={isConnected} />
              </Suspense>
            </TabsContent>

            <TabsContent value="statistics">
              <Suspense fallback={<StatisticsSkeleton />}>
                <Statistics userId={profileId} />
              </Suspense>
            </TabsContent>

            <TabsContent value="friends">
              <Suspense fallback={<FriendsSkeleton />}>
                <Friends profileId={profileId} />
              </Suspense>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Page;
