"use server";
import "server-only";

import sharp from "sharp";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { UUID } from "crypto";
import type { User, UserMetadata } from "@supabase/supabase-js";
import { summary } from "date-streaks";
import type { Tables } from "@/types/supabase";
import { createAdminClient } from "@/utils/supabase/admin";

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

  return { bio: bioData.bio, message: "Biographie mise à jour avec succès." };
}

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/tiff"
];

const avatarSchema = z.object({
  image: z
    .any()
    .refine(
      (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le type de fichier doit être une image (jpeg, jpg, png, webp)."
    )
});

export async function userUpdateAvatar(formData: FormData, userId: UUID) {
  const supabase = createClient();

  let avatarData;
  try {
    avatarData = avatarSchema.parse({
      image: formData.get("image")
    });
  } catch (error) {
    console.error(error);
    throw new Error("L'image doit être de type jpeg, jpg, png, tiff, webp ou avif.");
  }

  const fileName = `${userId}/avatar.webp`;

  const imageBuffer = await avatarData.image.arrayBuffer();
  const processedImageBuffer = await sharp(Buffer.from(imageBuffer))
    .resize(200, 200)
    .toFormat("webp")
    .toBuffer();

  const { error: updateAvatarError } = await supabase.storage
    .from("avatars")
    .upload(fileName, processedImageBuffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: "image/webp"
    });

  if (updateAvatarError) {
    console.error(updateAvatarError);
    throw new Error("Impossible de télécharger l'avatar.");
  }

  const { data: avatarUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);

  if (!avatarUrl) {
    throw new Error("Impossible d'obtenir l'URL publique de l'avatar.");
  }

  return { message: "Avatar mis à jour avec succès." };
}

export async function getUsersData(usersIds: UUID[]) {
  const supabaseAdmin = createAdminClient();

  const users: User[] = await Promise.all(
    usersIds.map(async (userId) => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (error) {
        console.error(error);
        throw new Error("Impossible de récupérer les amis.");
      }

      return data?.user;
    })
  );

  return users;
}

export async function getUserReadingStreak(userId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("read_summaries")
    .select("read_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer la série de lecture.");
  }

  const dates = data?.map((read) => new Date(read.read_at));

  const streakObject = summary({ dates });

  return streakObject;
}

export async function getUserReadsIds(userId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("read_summaries")
    .select("summary_id")
    .eq("user_id", userId);

  const reads = data?.map((read) => read.summary_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les lectures.");
  }

  return reads;
}

export async function hasUserSavedSummary(userId: UUID, summaryId: number) {
  const supabase = createClient();

  const { data: userLibraryData } = await supabase
    .from("saved_summaries")
    .select("*")
    .eq("user_id", userId);

  if (userLibraryData?.some((library) => library.summary_id === summaryId)) {
    return true;
  }
}

export async function hasUserReadSummary(userId: UUID, summaryId: number) {
  const supabase = createClient();

  const { data: userReadsData } = await supabase
    .from("read_summaries")
    .select("*")
    .eq("user_id", userId);

  if (userReadsData?.some((read) => read.summary_id === summaryId)) {
    return true;
  }
}

export async function getUserPersonalizedSummariesFromInterests(userId: UUID) {
  const supabase = createClient();

  const { data: userTopicsData } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", userId);
  const userTopics = userTopicsData?.flatMap((data) => data?.topics);

  const { data: summariesData } = await supabase
    .from("summaries")
    .select("*, authors(*), topics(*)");

  const userPersonalizedSummariesNotPopulated = summariesData?.filter((summary) =>
    userTopics?.some((topic) => topic?.id === summary?.topics?.id)
  ) as (Tables<"summaries"> & { topics: Tables<"topics">; authors: Tables<"authors"> })[];

  const alreadyReadSummaries = await getUserReadsIds(userId);

  const userPersonalizedSummaries = userPersonalizedSummariesNotPopulated
    ?.filter((summary) => {
      return !alreadyReadSummaries?.includes(summary?.id);
    })
    ?.map((summary) => ({
      ...summary,
      topic: summary?.topics?.name,
      author_slug: summary?.authors?.slug
    })) as (Tables<"summaries"> & { topic: string; author_slug: string } & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[];

  return userPersonalizedSummaries;
}

export async function getUserSummariesFromLibrary(userId: UUID) {
  const supabase = createClient();

  const { data: userLibraryData } = await supabase
    .from("saved_summaries")
    .select("summaries(*, authors(*), topics(*))")
    .eq("user_id", userId);

  const userLibrarySummaries = userLibraryData?.map((libraryData) => ({
    ...libraryData?.summaries,
    topic: libraryData?.summaries?.topics?.name,
    author_slug: libraryData?.summaries?.authors?.slug
  })) as (Tables<"summaries"> & { topic: string; author_slug: string } & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[];

  return userLibrarySummaries;
}

export async function getUserCustomAvatar(userId: UUID, userMetadata: UserMetadata) {
  const supabase = createClient();

  const fileName = `${userId}.webp`;

  const { data: avatarUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);

  let avatarUrlString: string;
  if (!avatarUrl) {
    avatarUrlString = userMetadata?.picture_url;
  } else {
    avatarUrlString = avatarUrl?.publicUrl;
  }

  return avatarUrlString;
}

export async function getUserCustomAvatarFromUserId(userId: UUID) {
  const supabaseAdmin = createAdminClient();

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);

  const supabase = createClient();

  const fileName = `${userId}.webp`;

  const { data } = await supabase.storage.from("avatars").list("", {
    search: fileName
  });

  if (data?.length === 0) {
    return userData?.user?.user_metadata?.picture ?? userData?.user?.user_metadata?.avatar_url;
  }

  const { data: avatarUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return avatarUrl?.publicUrl;
}

export async function getStorageAvatar(userId: UUID, profileMetadata: UserMetadata) {
  const supabase = createClient();

  const fileName = `${userId}.webp`;

  const { data } = await supabase.storage.from("avatars").list("", {
    search: fileName
  });

  if (data?.length === 0) {
    return profileMetadata?.picture ?? profileMetadata?.avatar_url;
  }

  const { data: avatarUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return avatarUrl?.publicUrl;
}

const removeDuplicates = (array: any[]) => {
  const uniqueSet = new Set();
  return array?.filter((item) => {
    if (!uniqueSet?.has(item?.summary_id)) {
      uniqueSet?.add(item?.summary_id);
      return true;
    }
    return false;
  });
};

export async function getUserReadSummaries(userId: UUID) {
  const supabase = createClient();

  const { data: profileReadsData } = await supabase
    .from("read_summaries")
    .select("*, summaries(*, topics(*), authors(*))")
    .eq("user_id", userId);

  const uniqueProfileReadsData = removeDuplicates(profileReadsData as any[]);

  const userReadSummaries = uniqueProfileReadsData?.map((readData) => ({
    ...readData?.summaries,
    topic: readData?.summaries?.topics?.name,
    author_slug: readData?.summaries?.authors?.slug
  }));

  return userReadSummaries;
}

export async function getUserSavedSummaries(userId: UUID) {
  const supabase = createClient();

  const { data: profileLibraryData } = await supabase
    .from("saved_summaries")
    .select("*, summaries(*, topics(*), authors(*))")
    .eq("user_id", userId);

  const uniqueProfileLibraryData = removeDuplicates(profileLibraryData as any[]);

  const userSavedSummaries = uniqueProfileLibraryData?.map((readData) => ({
    ...readData?.summaries,
    topic: readData?.summaries?.topics?.name,
    author_slug: readData?.summaries?.authors?.slug
  }));

  return userSavedSummaries;
}

export async function getUserTopics(user_id: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_topics")
    .select("topics(*)")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les intérêts.");
  }

  const topics = data?.flatMap((item) => item?.topics as Tables<"topics">);

  return topics;
}

export async function getSummariesRepartition(userId: UUID) {
  const supabaseAdmin = createAdminClient();

  const { data: readSummariesData, error: readSummariesError } = await supabaseAdmin
    .from("read_summaries")
    .select("*, summaries(*, topics(*))")
    .eq("user_id", userId);

  if (readSummariesError) {
    console.error(readSummariesError);
    throw new Error("Impossible de récupérer les lectures.");
  }

  const topics = readSummariesData?.map((read) => read?.summaries?.topics?.name);

  const topicsSet = new Set(topics);

  const topicsArray = Array.from(topicsSet);

  const topicsRepartition = topicsArray.map((topic) => {
    return {
      topic: topic as string,
      summaries: topics?.filter((topicName) => topicName === topic)?.length
    };
  });

  return topicsRepartition;
}
