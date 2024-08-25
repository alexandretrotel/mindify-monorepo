import H4Span from "@/components/typography/h4AsSpan";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import React, { Suspense } from "react";
import Image from "next/image";
import FriendshipButton from "@/components/features/profile/header/FriendshipButton";
import Friends from "@/components/features/profile/friends/Friends";
import ReadingStreak from "@/components/features/profile/header/ReadingStreak";
import LibrarySnippet from "@/components/features/profile/summaries/LibrarySnippet";
import LibrarySnippetSkeleton from "@/components/features/profile/summaries/skeleton/LibrarySnippetSkeleton";
import FriendsSkeleton from "@/components/features/profile/friends/skeleton/FriendsSkeleton";
import { getStorageAvatar, getUserCustomAvatarFromUserId } from "@/actions/users";
import { Muted } from "@/components/typography/muted";
import ProfileMinds from "@/components/features/profile/minds/ProfileMinds";
import MindsSkeleton from "@/components/global/skeleton/MindsSkeleton";
import { Carousel } from "@/components/ui/carousel";
import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/admin";
import Statistics from "@/components/features/profile/statistics/Statistics";
import StatisticsSkeleton from "@/components/features/profile/statistics/skeleton/StatisticsSkeleton";
import CopyProfileLink from "@/components/features/profile/header/CopyProfileLink";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProfileTopics from "@/components/features/profile/header/ProfileTopics";
import { Skeleton } from "@/components/ui/skeleton";
import SavedMinds from "@/components/features/profile/header/SavedMinds";
import ReadSummaries from "@/components/features/profile/header/ReadSummaries";
import BorderTabs from "@/components/global/BorderTabs";
import Footer from "@/components/features/home/Footer";
import AppHeader from "@/components/global/AppHeader";
import AccountDropdown from "@/components/global/AccountDropdown";
import profileBannerImage from "@/../public/profile/default-banner.webp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EllipsisIcon, UserRoundIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  const userMetadata = user?.user_metadata as UserMetadata;

  const isConnected = !!user;

  const supabaseAdmin = createAdminClient();

  const { data: profileData } = await supabaseAdmin.auth.admin.getUserById(profileId);
  const profileMetadata: UserMetadata = profileData?.user?.user_metadata as UserMetadata;
  const profileAvatar = await getStorageAvatar(profileId, profileMetadata);

  const userId = user?.id as UUID;

  const isMyProfile = userId === profileId;

  return (
    <React.Fragment>
      <AppHeader isNotTransparent isNotFixed>
        <AccountDropdown userId={userId} userMetadata={userMetadata} isConnected={isConnected} />
      </AppHeader>

      <main>
        <div className="relative mb-[56px] h-[15vh] w-full md:mb-8 md:h-[25vh]">
          <Image
            src={profileBannerImage}
            alt="Profile Banner"
            layout="fill"
            objectFit="cover"
            priority
          />

          <div className="absolute inset-x-0 bottom-[-42px]">
            <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 md:px-0">
              <Avatar className="h-20 w-20 border-2 border-black">
                <AvatarImage src={profileAvatar} alt={userMetadata?.name} />
                <AvatarFallback>
                  {userMetadata?.name ? (
                    userMetadata?.name?.charAt(0)
                  ) : (
                    <UserRoundIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2 md:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline">
                      <EllipsisIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent>
                    <div className="flex flex-col gap-4">
                      <H4Span>Autres actions</H4Span>
                      <CopyProfileLink userId={profileId} userName={profileMetadata?.name} />
                    </div>
                  </PopoverContent>
                </Popover>

                {!isMyProfile && profileId ? (
                  <FriendshipButton
                    userId={userId}
                    profileId={profileId}
                    isConnected={isConnected}
                    size="sm"
                  />
                ) : (
                  <Button size="sm" disabled={!isConnected} asChild>
                    <Link href="/my-account">Modifier mon profil</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:flew-row mx-auto flex w-full flex-col justify-between p-4 pb-12 md:p-8">
          <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-8">
            <div className="flex w-full items-start justify-between gap-8">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex w-full flex-col">
                        <H4Span>{profileMetadata?.name}</H4Span>

                        <div className="flex w-full items-center gap-4">
                          <Suspense fallback={<Skeleton className="h-4 w-12" />}>
                            <ProfileTopics userId={profileId} userName={profileMetadata?.name} />
                          </Suspense>

                          <Suspense fallback={<Skeleton className="h-4 w-12" />}>
                            <ReadSummaries userId={profileId} userName={profileMetadata?.name} />
                          </Suspense>

                          <Suspense fallback={<Skeleton className="h-4 w-12" />}>
                            <SavedMinds userId={profileId} userName={profileMetadata?.name} />
                          </Suspense>

                          <Suspense fallback={<Skeleton className="h-4 w-12" />}>
                            <ReadingStreak userId={profileId} userName={profileMetadata?.name} />
                          </Suspense>
                        </div>
                      </div>

                      <Muted size="sm">{profileMetadata?.biography ?? "Aucune biographie"}</Muted>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex md:items-center md:gap-4">
                {!isMyProfile && profileId ? (
                  <FriendshipButton
                    userId={userId}
                    profileId={profileId}
                    isConnected={isConnected}
                    size="sm"
                  />
                ) : (
                  <Button size="sm" disabled={!isConnected} asChild>
                    <Link href="/my-account">Modifier mon profil</Link>
                  </Button>
                )}

                <CopyProfileLink userId={profileId} userName={profileMetadata?.name} />
              </div>
            </div>

            <BorderTabs
              elements={[
                { label: "Résumés", value: "summaries" },
                { label: "MINDS", value: "minds" },
                { label: "Statistiques", value: "statistics" },
                { label: "Amis", value: "friends" }
              ]}
            >
              <Suspense fallback={<LibrarySnippetSkeleton />}>
                <LibrarySnippet profileId={profileId} />
              </Suspense>

              <Suspense
                fallback={
                  <Carousel>
                    <MindsSkeleton />
                  </Carousel>
                }
              >
                <ProfileMinds
                  profileId={profileId}
                  userId={userId}
                  isConnected={isConnected}
                  userName={user?.user_metadata?.name}
                />
              </Suspense>

              <Suspense fallback={<StatisticsSkeleton />}>
                <Statistics userId={profileId} />
              </Suspense>

              <Suspense fallback={<FriendsSkeleton />}>
                <Friends
                  profileId={profileId}
                  profileName={profileMetadata?.name}
                  isConnected={isConnected}
                />
              </Suspense>
            </BorderTabs>
          </div>
        </div>
      </main>

      <Footer />
    </React.Fragment>
  );
};

export default Page;
