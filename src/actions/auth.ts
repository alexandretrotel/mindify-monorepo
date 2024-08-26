"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { SocialProvider } from "@/types/auth";
import { headers } from "next/headers";

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

export async function resetPassword(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error(error);
    throw new Error("Impossible de réinitialiser le mot de passe");
  }

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
}

const formDataUpdatePasswordSchema = z
  .object({
    newPassword: z
      .string({
        invalid_type_error: "Mot de passe invalide"
      })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string({
      invalid_type_error: "Mot de passe invalide"
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"]
  });

export async function updatePassword(newPassword: string, confirmPassword: string) {
  const supabase = createClient();

  if (newPassword !== confirmPassword) {
    throw new Error("Les mots de passe ne correspondent pas");
  }

  let data;
  try {
    data = formDataUpdatePasswordSchema.parse({
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
