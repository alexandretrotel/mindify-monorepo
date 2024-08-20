import AccountDropdown from "@/components/global/AccountDropdown";
import H4Span from "@/components/typography/h4AsSpan";
import Span from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import React, { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CopyProfileLinkButton from "@/components/features/profile/header/CopyProfileLink";
import Friendship from "@/components/features/profile/header/Friendship";
import MyFriends from "@/components/features/profile/friends/MyFriends";
import Friends from "@/components/features/profile/friends/Friends";
import ReadingStreak from "@/components/features/profile/header/ReadingStreak";
import TopicsList from "@/components/features/profile/topics/TopicsList";
import ResponsiveTooltip from "@/components/global/ResponsiveTooltip";
import { CircleHelpIcon } from "lucide-react";
import LibrarySnippet from "@/components/features/profile/library/LibrarySnippet";
import LibrarySnippetSkeleton from "@/components/features/profile/library/skeleton/LibrarySnippetSkeleton";
import FriendsSkeleton from "@/components/features/profile/friends/skeleton/FriendsSkeleton";
import MyFriendsSkeleton from "@/components/features/profile/friends/skeleton/MyFriendsSkeleton";
import TopicsListSkeleton from "@/components/features/profile/topics/skeleton/TopicsListSkeleton";
import { getStorageAvatar, getUserCustomAvatarFromUserId } from "@/actions/users";
import { Muted } from "@/components/typography/muted";
import ProfileMinds from "@/components/features/profile/minds/ProfileMinds";
import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";
import { Carousel } from "@/components/ui/carousel";
import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";

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
      url: `https://mindify.vercel.app/app/profile/${profileId}`
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
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const supabaseAdmin = createAdminClient();

  const { data: profileData } = await supabaseAdmin.auth.admin.getUserById(profileId);
  let profileMetadata: UserMetadata = profileData?.user?.user_metadata as UserMetadata;

  const profilePicture = await getStorageAvatar(profileData?.user?.id as UUID, profileMetadata);

  const userId = data?.user?.id as UUID;
  const userMetadata = data?.user?.user_metadata;

  const isMyProfile = userId === profileId;

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 md:gap-8">
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={profilePicture} alt={profileMetadata?.name} />
                <AvatarFallback>
                  {profileMetadata?.name ? profileMetadata?.name?.charAt(0) : "J"}
                </AvatarFallback>
              </Avatar>

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

        <AccountDropdown userId={userId} userMetadata={userMetadata} />
      </div>

      <div className="flex w-full flex-wrap items-center gap-4">
        {isMyProfile || !profileId ? (
          <React.Fragment>
            <Button size="sm" disabled>
              Modifier le profil
            </Button>

            <CopyProfileLinkButton userId={userId} />
          </React.Fragment>
        ) : (
          <Friendship userId={userId} profileId={profileId} />
        )}
      </div>

      <Separator />

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-8 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Span size="lg" semibold>
              <span className="flex items-center">
                Intérêts{" "}
                <ResponsiveTooltip
                  text="Les intérêts en communs avec vous sont affichés en couleur."
                  align="center"
                  side="bottom"
                  cursor="help"
                >
                  <CircleHelpIcon className="ml-1 h-4 w-4" />
                </ResponsiveTooltip>
              </span>
            </Span>

            <Suspense fallback={<TopicsListSkeleton />}>
              <TopicsList profileId={profileId} userId={userId} />
            </Suspense>
          </div>

          <div className="flex flex-col gap-4">
            <Span size="lg" semibold>
              <span className="flex items-center">Résumés</span>
            </Span>

            <Suspense fallback={<LibrarySnippetSkeleton />}>
              <LibrarySnippet profileId={profileId} />
            </Suspense>
          </div>

          <Suspense
            fallback={
              <Carousel>
                <MindsSkeleton />
              </Carousel>
            }
          >
            <ProfileMinds profileId={profileId} userId={userId} />
          </Suspense>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-4">
            <div className="flex flex-col gap-4">
              <Span size="lg" semibold>
                <span className="flex items-center">Amis</span>
              </Span>

              <div className="w-full">
                {isMyProfile ? (
                  <Suspense fallback={<MyFriendsSkeleton />}>
                    <MyFriends userId={userId} />
                  </Suspense>
                ) : (
                  <Suspense fallback={<FriendsSkeleton />}>
                    <Friends profileId={profileId} profileMetadata={profileMetadata} />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
