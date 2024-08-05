import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, SendIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vérifier son mail | Mindify"
};

export default async function CheckEmail() {
  return (
    <Card className="mx-auto w-full max-w-sm border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Vérifiez vos mails
        </CardTitle>
        <CardDescription>Vous avez reçu un mail de vérification.</CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href="https://mail.google.com" target="_blank">
            Gmail <SendIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button asChild>
          <Link href="https://mail.yahoo.com" target="_blank">
            Yahoo Mail <SendIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button asChild>
          <Link href="https://mail.proton.me" target="_blank">
            ProtonMail <SendIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
