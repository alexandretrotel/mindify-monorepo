"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { SocialProvider } from "@/types/auth";
import { headers } from "next/headers";

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
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
});

const formDataSignupSchema = z.object({
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
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
  firstName: z.string({
    invalid_type_error: "Prénom invalide"
  }),
  lastName: z.string({
    invalid_type_error: "Nom invalide"
  })
});

export async function signUpWithPassword(formData: FormData) {
  const supabase = createClient();

  let data;
  try {
    data = formDataSignupSchema.parse({
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
  const supabase = createClient();

  let data;
  try {
    data = formDataSchema.parse({
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
  redirect("/discover");
}

export async function signInWithEmail(formData: FormData) {
  const supabase = createClient();

  const origin = headers().get("origin");

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
      emailRedirectTo: `${origin}/discover`
    }
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se connecter avec cette adresse e-mail");
  }

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
}

export async function signInWithSocials(provider: SocialProvider) {
  const supabase = createClient();

  const origin = headers().get("origin");

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
  const supabase = createClient();

  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    console.error(error);
    throw new Error("Impossible de se déconnecter");
  }

  revalidatePath("/", "layout");
}
