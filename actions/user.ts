"use server";
import "server-only";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UUID } from "crypto";
import type { User } from "@supabase/supabase-js";

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

export async function userUpdateBiography(biography: string) {
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

const MAX_FILE_SIZE = 2000000; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const avatarSchema = z.object({
  image: z
    .any()
    .refine(
      (file: File) => file?.size <= MAX_FILE_SIZE,
      `La taille de l'image doit être inférieure à ${MAX_FILE_SIZE / 1000000} Mo.`
    )
    .refine(
      (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le type de fichier doit être une image (jpeg, jpg, png, webp)."
    )
});

export async function userUpdateAvatar(formData: FormData) {
  const supabase = createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("Utilisateur non authentifié.");
  }

  let avatarData;
  try {
    avatarData = avatarSchema.parse({
      image: formData.get("image")
    });
  } catch (error) {
    console.error(error);
    throw new Error("L'image doit être de type jpeg, jpg, png ou webp et faire moins de 500 Ko.");
  }

  const fileExtension = avatarData.image.name.split(".").pop();
  const fileName = `${userData.user.id}/avatar.${fileExtension}`;

  const { error: updateAvatarError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatarData.image, {
      cacheControl: "3600",
      upsert: true
    });

  if (updateAvatarError) {
    console.error(updateAvatarError);
    throw new Error("Impossible de mettre à jour l'avatar.");
  }

  const { data: avatarUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);

  if (!avatarUrl) {
    throw new Error("Impossible d'obtenir l'URL publique de l'avatar.");
  }

  const { error: updateAvatarUrlError } = await supabase.auth.updateUser({
    data: {
      avatar_url: avatarUrl.publicUrl
    }
  });

  if (updateAvatarUrlError) {
    console.error(updateAvatarUrlError);
    throw new Error("Impossible de mettre à jour l'URL de l'avatar.");
  }

  revalidatePath("/", "layout");
  return { message: "Avatar mis à jour avec succès." };
}

export async function getUsersData({ usersIds }: { usersIds: UUID[] }) {
  let users: User[] = [];

  usersIds.forEach(async (userId) => {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (error) {
      console.error(error);
      throw new Error("Impossible de récupérer les amis.");
    }

    if (data) {
      users.push(data.user);
    }
  });

  return users;
}
