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
import { getAvatar } from "@/utils/users";
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
import { CalendarIcon, EllipsisIcon, UserRoundIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import AccountAvatar from "@/components/features/account/tabs/profile/Avatar";
import AccountName from "@/components/features/account/tabs/profile/Name";
import AccountBiography from "@/components/features/account/tabs/profile/Biography";

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
            getAvatar(userData?.user?.user_metadata as UserMetadata) ?? "/open-graph/og-image.png"
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
            getAvatar(userData?.user?.user_metadata as UserMetadata) ?? "/open-graph/og-image.png"
        }
      ]
    }
  };
}

export type UserTab = "summaries" | "minds" | "statistics" | "friends";

const Page = async ({
  params,
  searchParams
}: {
  params: { uuid: UUID };
  searchParams: {
    tab: UserTab;
  };
}) => {
  const profileId = params.uuid;
  const tab = searchParams.tab;

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userMetadata = user?.user_metadata as UserMetadata;

  const isConnected = !!user;

  const supabaseAdmin = createAdminClient();

  const { data: profileData } = await supabaseAdmin.auth.admin.getUserById(profileId);
  const profileUser = profileData?.user;
  const profileMetadata: UserMetadata = profileData?.user?.user_metadata as UserMetadata;
  const profileAvatar = getAvatar(profileMetadata);

  const userId = user?.id as UUID;

  const isMyProfile = userId === profileId;

  let userAvatar: string | undefined;
  if (isMyProfile) {
    userAvatar = getAvatar(user?.user_metadata as UserMetadata);
  }

  return (
    <React.Fragment>
      <AppHeader isNotTransparent isNotFixed>
        <AccountDropdown userId={userId} userMetadata={userMetadata} isConnected={isConnected} />
      </AppHeader>

      <main>
        <div className="relative mb-[56px] h-[15vh] w-full md:mb-8 md:h-[25vh]">
          <Image src={profileBannerImage} alt="Profile Banner" layout="fill" objectFit="cover" />

          <div className="absolute inset-x-0 bottom-[-42px]">
            <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-4 md:px-0">
              <Dialog>
                <DialogTrigger>
                  <Avatar className="h-20 w-20 border-2 border-background">
                    <AvatarImage src={profileAvatar} alt={userMetadata?.name} />
                    <AvatarFallback>
                      <UserRoundIcon className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </DialogTrigger>

                <DialogContent className="max-w-xs md:max-w-lg">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={profileAvatar} alt={userMetadata?.name} />
                      <AvatarFallback>
                        <UserRoundIcon className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <H4Span>{profileMetadata?.name}</H4Span>
                      <span className="flex items-center gap-1">
                        <Muted size="sm">
                          Membre depuis le{" "}
                          {new Date(profileUser?.created_at as string).toLocaleDateString("fr-FR")}
                        </Muted>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-2">
                <div className="block md:hidden">
                  <Popover>
                    <PopoverTrigger>
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
                </div>

                <div className="hidden md:block">
                  <CopyProfileLink userId={profileId} userName={profileMetadata?.name} />
                </div>

                {!isMyProfile && profileId ? (
                  <FriendshipButton
                    userId={userId}
                    profileId={profileId}
                    isConnected={isConnected}
                    size="sm"
                  />
                ) : (
                  <Dialog>
                    <DialogTrigger>
                      <Button size="sm" disabled={!isConnected}>
                        Modifier mon profil
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-xs md:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-left">Modifier le profil</DialogTitle>
                        <DialogDescription className="text-left">
                          <Muted size="sm">
                            Vous pouvez modifier les informations de votre profil.
                          </Muted>
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex flex-col gap-8">
                        <AccountAvatar
                          userId={userId}
                          userMetadata={userMetadata}
                          userPicture={userAvatar as string}
                        />
                        <AccountName userMetadata={userMetadata} />
                        <AccountBiography userMetadata={userMetadata} />
                      </div>
                    </DialogContent>
                  </Dialog>
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

                      <Muted size="sm">
                        {profileMetadata?.biography && profileMetadata?.biography?.length > 0
                          ? profileMetadata?.biography
                          : "Aucune biographie"}
                      </Muted>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <BorderTabs
              defaultTab={tab}
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
