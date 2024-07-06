import TypographyH3AsSpan from "@/components/typography/h3AsSpan";
import TypographyP from "@/components/typography/p";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/account/navigation";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Account() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col gap-8 p-8 py-12">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <TypographyH3AsSpan>Mon compte</TypographyH3AsSpan>
          <TypographyP muted>
            Gérez les paramètres de votre compte et définissez vos préférences de notification.
          </TypographyP>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <XIcon className="h-6 w-6" />
            </Link>
          </Button>
        </div>
      </div>
      <Separator />
      <Navigation />
    </div>
  );
}
