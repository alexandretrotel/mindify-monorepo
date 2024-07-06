import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail, signInWithSocials } from "@/actions/auth";
import { SubmitButton } from "@/components/global/submitButton";
import type { SocialProvider } from "@/types/auth/providers";
import { z } from "zod";

const providerSchema = z.custom<SocialProvider>();

export default function AuthProviders({ isSignup }: Readonly<{ isSignup?: boolean }>) {
  const handleSignInWithSocials = async (formData: FormData) => {
    "use server";

    let provider;

    try {
      provider = providerSchema.parse(formData.get("provider"));
    } catch (error) {
      console.error(error);
      return;
    }

    if (provider) {
      await signInWithSocials(provider);
    }
  };

  return (
    <div className="grid gap-4">
      <form action={signInWithEmail} className="grid gap-4" method="post">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="jean@mindify.fr" required />
        </div>
        <SubmitButton>{isSignup ? "S'inscrire" : "Se connecter"}</SubmitButton>
      </form>
      <form action={handleSignInWithSocials} method="post">
        <input type="hidden" name="provider" value="google" />
        <SubmitButton outline>S&apos;inscrire avec Google</SubmitButton>
      </form>
      <form action={handleSignInWithSocials} method="post">
        <input type="hidden" name="provider" value="facebook" />
        <SubmitButton outline>S&apos;inscrire avec Facebook</SubmitButton>
      </form>
      <form action={handleSignInWithSocials} method="post">
        <input type="hidden" name="provider" value="linkedin_oidc" />
        <SubmitButton outline>S&apos;inscrire avec Linkedin</SubmitButton>
      </form>
    </div>
  );
}
