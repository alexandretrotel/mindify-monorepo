"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const nameSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(30, "Le nom ne doit pas dépasser 30 caractères.")
});

export async function userUpdateName(name: string) {
  const supabase = createClient();

  let nameData;
  try {
    nameData = nameSchema.parse({
      name
    });
  } catch (error) {
    console.error(error);
    throw new Error("Le nom doit contenir entre 2 et 30 caractères.");
  }

  const { error: updateNameError } = await supabase.auth.updateUser({
    data: {
      name: nameData.name
    }
  });

  if (updateNameError) {
    console.error(updateNameError);
    throw new Error("Impossible de mettre à jour le nom.");
  }

  revalidatePath("/", "layout");
  return { name, message: "Nom mis à jour avec succès." };
}

const bioSchema = z.object({
  bio: z.string().max(160, "La bio ne doit pas dépasser 160 caractères.")
});

export async function userUpdateBio(biography: string) {
  const supabase = createClient();

  let bioData;
  try {
    bioData = bioSchema.parse({
      bio: biography
    });
  } catch (error) {
    console.error(error);
    throw new Error("La bio ne doit pas dépasser 160 caractères.");
  }

  const { error: updateBioError } = await supabase.auth.updateUser({
    data: {
      biography: bioData.bio
    }
  });

  if (updateBioError) {
    console.error(updateBioError);
    throw new Error("Impossible de mettre à jour la bio.");
  }

  revalidatePath("/", "layout");
  return { bio: bioData.bio, message: "Biographie mise à jour avec succès." };
}
