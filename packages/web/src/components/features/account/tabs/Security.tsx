import H3Span from "@/components/typography/h3AsSpan";
import { Muted } from "@/components/typography/muted";
import { Separator } from "@/components/ui/separator";
import React from "react";
import DeleteAccount from "@/components/features/account/tabs/security/DeleteAccount";
import type { UUID } from "crypto";
import ChangePassword from "@/components/features/account/tabs/security/ChangePassword";

export default function AccountSecurity({ userId }: Readonly<{ userId: UUID }>) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <H3Span>Sécurité</H3Span>
        <Muted size="sm">
          Changez votre mot de passe et configurez les paramètres de sécurité de votre compte.
        </Muted>
      </div>

      <Separator className="max-w-lg" />

      <div className="flex max-w-lg flex-col gap-8">
        <ChangePassword />
        <DeleteAccount userId={userId} />
      </div>
    </div>
  );
}
