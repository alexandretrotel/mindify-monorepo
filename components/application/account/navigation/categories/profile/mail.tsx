import TypographySpan from "@/components/typography/span";
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
      <TypographySpan muted size="sm">
        Ceci est l&apos;adresse email que vous utilisez pour vous connecter à votre compte Mindify.
        Personne d&apos;autre que vous ne pouvez la voir. Vous ne pouvez pas la modifier.
      </TypographySpan>
    </div>
  );
}
