import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Separator } from "@/components/ui/separator";
import type { UserMetadata } from "@supabase/supabase-js";
import AccountBiography from "@/src/app/app/(middleware)/components/account/navigation/categories/profile/Biography";
import AccountMail from "@/src/app/app/(middleware)/components/account/navigation/categories/profile/Mail";
import AccountName from "@/src/app/app/(middleware)/components/account/navigation/categories/profile/Name";
import AccountAvatar from "@/src/app/app/(middleware)/components/account/navigation/categories/profile/Avatar";
import AccountTopics from "@/src/app/app/(middleware)/components/account/navigation/categories/profile/Topics";
import type { Topics } from "@/types/topics";
import { UUID } from "crypto";

export default function AccountProfile({
  userId,
  userMetadata,
  topics,
  userTopics
}: Readonly<{ userId: UUID; userMetadata: UserMetadata; topics: Topics; userTopics: Topics }>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <TypographyH3AsSpan>Profil</TypographyH3AsSpan>
        <TypographyP muted>
          Renseignez les informations que les autres utilisateurs verront sur votre profil.
        </TypographyP>
      </div>

      <Separator className="max-w-lg" />

      <div className="flex max-w-lg flex-col gap-8">
        <AccountAvatar userMetadata={userMetadata} />
        <AccountName userMetadata={userMetadata} />
        <AccountMail userMetadata={userMetadata} />
        <AccountBiography userMetadata={userMetadata} />
        <AccountTopics userId={userId} topics={topics} userTopics={userTopics} />
      </div>
    </div>
  );
}
