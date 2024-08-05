import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthProviders from "@/app/app/(auth)/components/AuthProviders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "S'inscrire | Mindify",
  openGraph: {
    title: "S'inscrire | Mindify"
  },
  twitter: {
    title: "S'inscrire | Mindify"
  }
};

export default function SignupForm() {
  return (
    <Card className="mx-auto w-full max-w-sm border-none !bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>Rentre tes informations pour créer ton compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthProviders isSignup={true} />
        <div className="mt-4 text-center text-sm">
          Déjà un compte?{" "}
          <Link href="/app/login" className="underline">
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
