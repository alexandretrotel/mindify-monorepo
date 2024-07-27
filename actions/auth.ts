"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { SocialProvider } from "@/types/auth/providers";

const formDataMailSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide"
    })
    .email()
});

const formDataSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide"
    })
    .email(),
  password: z
    .string({
      invalid_type_error: "Mot de passe invalide"
    })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
});

const domain =
  process.env.NODE_ENV === "production" ? "https://www.mindify.fr" : "http://localhost:3000";

export async function signUpWithPassword(formData: FormData) {
  const supabase = createClient();

  let globalError = false;
  let data;
  try {
    data = formDataSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string
    });
  } catch (error) {
    globalError = true;
    console.error(error);
    throw new Error("Identifiants invalides");
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de créer le compte. Veuillez réessayer plus tard.");
  }

  revalidatePath("/", "layout");

  if (!error || !globalError) {
    redirect("/app/check-email");
  }
}

export async function signInWithPassword(formData: FormData) {
  const supabase = createClient();

  let globalError = false;
  let data;
  try {
    data = formDataSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string
    });
  } catch (error) {
    globalError = true;
    console.error(error);
    throw new Error("Identifiants invalides");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se connecter avec ces identifiants. Veuillez réessayer.");
  }

  revalidatePath("/", "layout");

  if (!error || !globalError) {
    redirect("/app");
  }
}

export async function signInWithEmail(formData: FormData) {
  const supabase = createClient();

  let globalError = false;
  let data;
  try {
    data = formDataMailSchema.parse({
      email: formData.get("email") as string
    });
  } catch (error) {
    console.error(error);
    throw new Error("Adresse e-mail invalide");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${domain}`
    }
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se connecter avec cette adresse e-mail");
  }

  revalidatePath("/", "layout");

  if (!error || !globalError) {
    redirect("/app/check-email");
  }
}

export async function signInWithSocials(provider: SocialProvider) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${domain}/auth/callback`,
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

  if (data.url) {
    redirect(data.url);
  }

  revalidatePath("/", "layout");
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se déconnecter");
  }

  revalidatePath("/", "layout");
}
