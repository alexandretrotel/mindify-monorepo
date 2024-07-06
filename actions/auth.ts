"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";
import { SocialProvider } from "@/types/auth/providers";

const formDataSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Adresse e-mail invalide"
    })
    .email()
});

const domain =
  process.env.NODE_ENV === "production" ? "https://www.mindify.fr" : "http://localhost:3000";

export async function signInWithEmail(formData: FormData) {
  const supabase = createClient();

  let data;

  try {
    data = formDataSchema.parse({
      email: formData.get("email") as string
    });
  } catch (error) {
    console.error(error);
    redirect("/error");
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
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/check-email");
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
    redirect("/error");
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
    redirect("/error");
  }

  revalidatePath("/", "layout");
}
