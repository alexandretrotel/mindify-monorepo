import TypographyP from "@/components/typography/p";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserMetadata } from "@supabase/supabase-js";

export default function AccountMail({ userMetadata }: Readonly<{ userMetadata: UserMetadata }>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email" className="text-text text-sm font-medium">
        Email
      </Label>
      <Input
        disabled
        type="email"
        id="email-display"
        name="email-display"
        placeholder={userMetadata.email}
      />
      <TypographyP muted size="sm">
        L&apos;email que vous utilisez pour vous connecter. Elle est privée et ne peut pas être
        modifiée.
      </TypographyP>
    </div>
  );
}
