import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import { Separator } from "@/components/ui/separator";
import type { UserMetadata } from "@supabase/supabase-js";
import AccountBiography from "@/app/app/(middleware)/components/account/navigation/categories/profile/Biography";
import AccountMail from "@/app/app/(middleware)/components/account/navigation/categories/profile/Mail";
import AccountName from "@/app/app/(middleware)/components/account/navigation/categories/profile/Name";
import AccountAvatar from "@/app/app/(middleware)/components/account/navigation/categories/profile/Avatar";
import AccountTopics from "@/app/app/(middleware)/components/account/navigation/categories/profile/Topics";
import { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";
import type { Tables } from "@/types/supabase";

export default function AccountProfile({
  userId,
  userMetadata,
  topics,
  userTopics,
  userPicture
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
}>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <TypographyH3AsSpan>Profil</TypographyH3AsSpan>
        <TypographySpan muted>
          Renseignez les informations que les autres utilisateurs verront sur votre profil.
        </TypographySpan>
      </div>

      <Separator className="max-w-lg" />

      <div className="flex max-w-lg flex-col gap-8">
        <AccountAvatar userMetadata={userMetadata} userPicture={userPicture} />
        <AccountName userMetadata={userMetadata} />
        <AccountMail userMetadata={userMetadata} />
        <AccountBiography userMetadata={userMetadata} />
        <AccountTopics userId={userId} topics={topics} userTopics={userTopics} />
      </div>
    </div>
  );
}
