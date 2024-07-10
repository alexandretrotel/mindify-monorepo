import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { Separator } from "@/components/ui/separator";
import type { UserMetadata } from "@supabase/supabase-js";
import AccountBiography from "@/components/application/account/navigation/categories/profile/biography";
import AccountMail from "@/components/application/account/navigation/categories/profile/mail";
import AccountName from "@/components/application/account/navigation/categories/profile/name";
import AccountAvatar from "@/components/application/account/navigation/categories/profile/avatar";

export default function AccountProfile({ userMetadata }: Readonly<{ userMetadata: UserMetadata }>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <TypographyH3AsSpan>Profil</TypographyH3AsSpan>
        <TypographyP muted>
          Ce sont les informations que les autres verront sur le site.
        </TypographyP>
      </div>

      <Separator className="max-w-lg" />

      <div className="flex max-w-lg flex-col gap-8">
        <AccountAvatar userMetadata={userMetadata} />
        <AccountName userMetadata={userMetadata} />
        <AccountMail userMetadata={userMetadata} />
        <AccountBiography userMetadata={userMetadata} />
      </div>
    </div>
  );
}
