import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/actions/auth";

export default function LoginForm() {
  return (
    <Card className="mx-auto w-full max-w-sm border-none bg-background shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Se connecter</CardTitle>
        <CardDescription>Rentre ton mail pour te connecter à ton compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jean@mindify.fr" required />
          </div>
          <Button type="submit" className="w-full" formAction={login}>
            Se connecter
          </Button>
          <Button variant="outline" className="w-full">
            Connexion avec GitHub
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Pas encore de compte?{" "}
          <Link href="/signup" className="underline">
            S&apos;inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
