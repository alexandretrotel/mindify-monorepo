"use client";
import "client-only";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPassword, signInWithSocials, signUpWithPassword } from "@/actions/auth.action";
import { SubmitButton } from "@/components/global/buttons/SubmitButton";
import type { SocialProvider } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AuthProviders({ isSignup }: Readonly<{ isSignup: boolean }>) {
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { toast } = useToast();

  const handleSignInWithSocials = async (provider: SocialProvider) => {
    setIsLoading(true);

    try {
      await signInWithSocials(provider);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter avec ce fournisseur.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpOrSignIn = async (formData: FormData) => {
    setIsLoading(true);

    if (isSignup) {
      try {
        await signUpWithPassword(formData);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de s'inscrire.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await signInWithPassword(formData);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de se connecter.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="grid gap-4">
      <form action={handleSignUpOrSignIn} className="grid gap-4" method="post">
        <div className="grid gap-4">
          {isSignup && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" type="text" name="firstName" placeholder="Jean" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" type="text" name="lastName" placeholder="Dupont" required />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="jean@mindify.fr" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <SubmitButton>{isSignup ? "S'inscrire" : "Se connecter"}</SubmitButton>
      </form>

      <Button
        variant="outline"
        onClick={() => handleSignInWithSocials("google")}
        disabled={isLoading}
      >
        {isSignup ? "S'inscrire" : "Se connecter"} avec Google
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSignInWithSocials("apple")}
        disabled={isLoading}
      >
        {isSignup ? "S'inscrire" : "Se connecter"} avec Apple
      </Button>
    </div>
  );
}
