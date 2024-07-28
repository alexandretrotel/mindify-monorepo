import AccountDropdown from "@/components/global/AccountDropdown";
import TypographyH4AsSpan from "@/components/typography/h4AsSpan";
import TypographyP from "@/components/typography/p";
import TypographySpan from "@/components/typography/span";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import React, { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseAdmin } from "@/utils/supabase/admin";
import CopyProfileLinkButton from "@/app/app/(middleware)/profile/components/header/CopyProfileLink";
import Friendship from "@/app/app/(middleware)/profile/components/header/Friendship";
import MyFriends from "@/app/app/(middleware)/profile/components/friends/MyFriends";
import Friends from "@/app/app/(middleware)/profile/components/friends/Friends";
import ReadingStreak from "@/app/app/(middleware)/profile/components/header/ReadingStreak";
import TopicsList from "@/app/app/(middleware)/profile/components/topics/TopicsList";
import ResponsiveTooltip from "@/components/global/ResponsiveTooltip";
import { CircleHelpIcon } from "lucide-react";
import LibrarySnippet from "@/app/app/(middleware)/profile/components/library/LibrarySnippet";
import LibrarySnippetSkeleton from "@/app/app/(middleware)/profile/components/library/skeleton/LibrarySnippetSkeleton";
import FriendsSkeleton from "@/app/app/(middleware)/profile/components/friends/skeleton/FriendsSkeleton";
import MyFriendsSkeleton from "@/app/app/(middleware)/profile/components/friends/skeleton/MyFriendsSkeleton";
import TopicsListSkeleton from "@/app/app/(middleware)/profile/components/topics/skeleton/TopicsListSkeleton";

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

  const isMyProfile = userId === profileId;

  if (!profileId || userId === profileId) {
    profileId = userId;
    profileMetadata = userMetadata;
  }

  return (
    <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col gap-4 md:gap-8">
      <div className="flex w-full items-center justify-between gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={profileMetadata?.picture} alt={profileMetadata?.name} />
                <AvatarFallback>
                  {profileMetadata?.name ? profileMetadata?.name?.charAt(0) : "J"}
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

        <AccountDropdown />
      </div>

      <div className="flex w-full flex-wrap items-center gap-4">
        {isMyProfile || !profileId ? (
          <>
            <Button size="sm" disabled>
              Modifier le profil
            </Button>

            <CopyProfileLinkButton userId={userId} />
          </>
        ) : (
          <Friendship userId={userId} profileId={profileId} />
        )}
      </div>

      <Separator />

      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row">
        <div className="flex max-w-2xl flex-col gap-8 lg:min-w-0 lg:grow">
          <div className="flex flex-col gap-4">
            <TypographySpan isDefaultColor size="lg" semibold>
              <span className="flex items-center">
                Intérêts{" "}
                <ResponsiveTooltip
                  text="Les intérêts communs aux vôtres sont affichés en vert."
                  align="center"
                  side="bottom"
                  cursor="help"
                >
                  <CircleHelpIcon className="ml-1 h-4 w-4" />
                </ResponsiveTooltip>
              </span>
            </TypographySpan>

            <Suspense fallback={<TopicsListSkeleton />}>
              <TopicsList profileId={profileId} userId={userId} />
            </Suspense>
          </div>

          <Suspense fallback={<LibrarySnippetSkeleton />}>
            <LibrarySnippet profileId={profileId} />
          </Suspense>
        </div>

        <div className="flex w-full flex-col gap-8 lg:max-w-md">
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
  );
};

export default Page;
