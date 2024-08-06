import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthProviders from "@/app/app/(auth)/components/AuthProviders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Se connecter | Mindify",
  openGraph: {
    title: "Se connecter | Mindify"
  },
  twitter: {
    title: "Se connecter | Mindify"
  }
};

export default function LoginForm() {
  return (
    <Card className="mx-auto w-full max-w-sm border-none !bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Se connecter</CardTitle>
        <CardDescription>Rentre ton mail pour te connecter à ton compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthProviders isSignup={false} />
        <div className="mt-4 text-center text-sm">
          Pas encore de compte?{" "}
          <Link href="/auth/signup" className="underline">
            S&apos;inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
