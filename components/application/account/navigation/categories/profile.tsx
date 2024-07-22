import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Separator } from "@/components/ui/separator";
import type { UserMetadata } from "@supabase/supabase-js";
import AccountBiography from "@/components/application/account/navigation/categories/profile/biography";
import AccountMail from "@/components/application/account/navigation/categories/profile/mail";
import AccountName from "@/components/application/account/navigation/categories/profile/name";
import AccountAvatar from "@/components/application/account/navigation/categories/profile/avatar";
import AccountTopics from "@/components/application/account/navigation/categories/profile/topics";
import type { Topics, UserTopics } from "@/types/topics/topics";
import { UUID } from "crypto";

export default function AccountProfile({
  userId,
  userMetadata,
  topics,
  userTopics
}: Readonly<{ userId: UUID; userMetadata: UserMetadata; topics: Topics; userTopics: UserTopics }>) {
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
