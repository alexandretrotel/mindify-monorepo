"use server";
import "server-only";

import sharp from "sharp";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UUID } from "crypto";
import type { User } from "@supabase/supabase-js";
import { summary } from "date-streaks";
import type { Tables } from "@/types/supabase";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { type Card, createEmptyCard } from "ts-fsrs";

export async function deleteUser(userId: UUID) {
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error(deleteError);
    throw new Error("Impossible de supprimer le compte.");
  }

  revalidatePath("/", "layout");
  return { message: "Compte supprimé avec succès." };
}

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

  const { error: updateAvatarUrlError } = await supabase.auth.updateUser({
    data: {
      custom_avatar: avatarUrl.publicUrl
    }
  });

  if (updateAvatarUrlError) {
    console.error(updateAvatarUrlError);
    throw new Error("Impossible de mettre à jour l'URL de l'avatar.");
  }

  revalidatePath("/", "layout");
  return { message: "Avatar mis à jour avec succès." };
}

export async function getUsersData(usersIds: UUID[]) {
  const users: (User | null)[] = await Promise.all(
    usersIds?.map(async (userId) => {
      try {
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (error) {
          return null;
        }

        return data?.user || null;
      } catch (err) {
        console.error(`Erreur en récupérant l'utilisateur ${userId}:`, err);
        return null;
      }
    })
  );

  const filteredUsers = users?.filter((user) => user !== null) as User[];

  return filteredUsers;
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

  return userReadSummaries as (Tables<"summaries"> & { topic: string; author_slug: string } & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[];
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

  return userSavedSummaries as (Tables<"summaries"> & { topic: string; author_slug: string } & {
    topics: Tables<"topics">;
    authors: Tables<"authors">;
  })[];
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

export async function getTopUsers() {
  const supabase = createClient();

  const { data: usersData } = await supabase.from("read_summaries").select("user_id");

  if (!usersData) {
    return [];
  }

  const usersIds = usersData?.map((user) => user?.user_id as UUID);

  const usersCount = usersIds?.reduce(
    (acc: { [key: UUID]: number }, user: UUID) => {
      acc[user] = (acc[user] || 0) + 1;
      return acc;
    },
    {} as { [key: UUID]: number }
  );

  const sortedUsers = Object.keys(usersCount)?.sort(
    (a, b) => usersCount?.[b as UUID] - usersCount?.[a as UUID]
  ) as UUID[];

  const topUsers = await getUsersData(sortedUsers);

  return topUsers;
}

export async function getUserSavedMinds(userId: UUID) {
  const supabase = createClient();

  const { data: savedMindsData, error } = await supabase
    .from("saved_minds")
    .select("*, minds(*, summaries(*, topics(*), authors(*)))")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds enregistrés.");
  }

  const savedMinds = savedMindsData?.map((savedMind) => ({
    ...savedMind?.minds,
    summaries: {
      ...savedMind?.minds?.summaries,
      topic: savedMind?.minds?.summaries?.topics?.name,
      author_slug: savedMind?.minds?.summaries?.authors?.slug
    }
  })) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { topic: string; author_slug: string } & {
      topics: Tables<"topics">;
      authors: Tables<"authors">;
    };
  })[];

  return savedMinds;
}

export async function getUserSavedMindsIds(userId: UUID) {
  const supabase = createClient();

  const { data: savedMindsData, error } = await supabase
    .from("saved_minds")
    .select("minds(id)")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds enregistrés.");
  }

  const savedMindsIds = savedMindsData?.map((savedMind) => savedMind?.minds?.id) as number[];

  return savedMindsIds;
}

export async function getUserDueMindsFromMindsIds(userId: UUID, mindsIds: number[]) {
  const supabase = createClient();

  const { data: dueMindsData, error } = await supabase
    .from("srs_data")
    .select("*, minds(*, summaries(*, topics(*), authors(*)))")
    .eq("user_id", userId)
    .in("mind_id", mindsIds);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les minds en attente.");
  }

  const existingMindIds = dueMindsData?.map((item) => item?.minds?.id);
  const missingMindIds = mindsIds?.filter((mindId) => !existingMindIds.includes(mindId));

  const emptyCard: Card = createEmptyCard();

  const cardsArray: Tables<"srs_data">[] = missingMindIds?.map((mindId) => ({
    user_id: userId,
    mind_id: mindId,
    due: emptyCard.due.toISOString(),
    stability: emptyCard.stability,
    difficulty: emptyCard.difficulty,
    elapsed_days: emptyCard.elapsed_days,
    scheduled_days: emptyCard.scheduled_days,
    reps: emptyCard.reps,
    lapses: emptyCard.lapses,
    state: emptyCard.state
  })) as Tables<"srs_data">[];

  if (missingMindIds.length > 0) {
    const { error: insertError } = await supabase.from("srs_data").insert(cardsArray);

    if (insertError) {
      console.error(insertError);
      throw new Error("Impossible d'insérer les minds manquants.");
    }
  }

  const { data: fullMindsData, error: fetchError } = await supabase
    .from("srs_data")
    .select("*, minds(*,summaries(*, topics(*), authors(*)))")
    .in("mind_id", mindsIds)
    .lte("due", new Date().toISOString());

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Impossible de récupérer les minds.");
  }

  const dueMinds = fullMindsData?.map((dueMind) => ({
    ...dueMind?.minds,
    summaries: {
      ...dueMind?.minds?.summaries,
      topic: dueMind?.minds?.summaries?.topics?.name,
      author_slug: dueMind?.minds?.summaries?.authors?.slug
    }
  })) as (Tables<"minds"> & {
    summaries: Tables<"summaries"> & { topic: string; author_slug: string } & {
      topics: Tables<"topics">;
      authors: Tables<"authors">;
    };
  })[];

  return dueMinds;
}

export async function postUserLearningSession(
  totalTime: number,
  totalLength: number,
  inactiveTime: number,
  userId: UUID
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("learning_sessions")
    .insert({
      user_id: userId,
      total_time: totalTime,
      total_length: totalLength,
      inactive_time: inactiveTime
    })
    .select();

  if (error) {
    console.error(error);
    throw new Error("Impossible de poster la session d'apprentissage.");
  }

  return data;
}

export async function getUserId() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const userId = user?.id as UUID;

  return userId;
}
