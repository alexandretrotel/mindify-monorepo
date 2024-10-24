"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginFormSchema, signupFormSchema, updatePasswordFormSchema } from "@/schema/auth.schema";
import { createClient } from "@/utils/supabase/server";
import { SocialProvider } from "@/types/auth";
import { headers } from "next/headers";

export async function signUpWithPassword(formData: FormData) {
  const supabase = await createClient();

  let data;
  try {
    data = signupFormSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string
    });
  } catch (error) {
    console.error(error);
    throw new Error("Identifiants invalides");
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        full_name: `${data.firstName} ${data.lastName}`
      }
    }
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de créer le compte. Veuillez réessayer plus tard.");
  }

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
}

export async function signInWithPassword(formData: FormData) {
  const supabase = await createClient();

  let data;
  try {
    data = loginFormSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string
    });
  } catch (error) {
    console.error(error);
    throw new Error("Identifiants invalides");
  }

  const { error, data: userData } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se connecter avec ces identifiants. Veuillez réessayer.");
  }

  if (userData?.weakPassword) {
    throw new Error("Le mot de passe est faible. Veuillez le changer.");
  }

  revalidatePath("/", "layout");
  redirect("/library");
}

export async function signInWithSocials(provider: SocialProvider) {
  const supabase = await createClient();

  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent"
      }
    }
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se connecter avec ce fournisseur");
  }

  if (data?.url) {
    redirect(data?.url);
  }

  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se déconnecter");
  }

  revalidatePath("/", "layout");
}

export async function resetPassword(email: string, origin: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/my-account?tab=security`
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de réinitialiser le mot de passe");
  }

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
}

export async function updatePassword(newPassword: string, confirmPassword: string) {
  const supabase = await createClient();

  if (newPassword !== confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas");
  }

  let data;
  try {
    data = updatePasswordFormSchema.parse({
      newPassword,
      confirmPassword
    });
  } catch (error) {
    console.error(error);
    throw new Error("Mot de passe invalide");
  }

  const { error } = await supabase.auth.updateUser({ password: data.newPassword });

  if (error) {
    console.error(error);
    throw new Error("Impossible de mettre à jour le mot de passe");
  }

  revalidatePath("/", "layout");
}
