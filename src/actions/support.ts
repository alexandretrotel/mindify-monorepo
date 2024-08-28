"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import z from "zod";
import type { Enums } from "@/types/supabase";
import { revalidatePath } from "next/cache";

const bugFormDataSchema = z.object({
  title: z.string(),
  type: z.string(),
  description: z.string()
});

export async function createBugReport(
  userId: UUID,
  title: string,
  type: Enums<"bugs">,
  description: string
) {
  const supabase = createClient();

  let finalTitle, finalType, finalDescription;
  try {
    const {
      title: titleData,
      type: typeData,
      description: descriptionData
    } = bugFormDataSchema.parse({
      title,
      type,
      description
    });

    if (!title || !type || !description) {
      throw new Error("Missing required fields");
    }

    finalTitle = titleData;
    finalType = typeData;
    finalDescription = descriptionData;
  } catch (error) {
    console.error(error);
    throw error;
  }

  const { error } = await supabase.from("support_bugs").insert({
    user_id: userId,
    title: finalTitle,
    bug_type: finalType as Enums<"bugs">,
    description: finalDescription
  });

  if (error) {
    console.error(error);
    throw error;
  }

  revalidatePath("/", "layout");
}

const featureFormDataSchema = z.object({
  title: z.string(),
  type: z.string(),
  description: z.string()
});

export async function createFeatureRequest(
  userId: UUID,
  title: string,
  type: Enums<"features">,
  description: string
) {
  const supabase = createClient();

  let finalTitle, finalType, finalDescription;
  try {
    const {
      title: titleData,
      type: typeData,
      description: descriptionData
    } = featureFormDataSchema.parse({
      title,
      type,
      description
    });

    if (!title || !type || !description) {
      throw new Error("Missing required fields");
    }

    finalTitle = titleData;
    finalType = typeData;
    finalDescription = descriptionData;
  } catch (error) {
    console.error(error);
    throw error;
  }

  const { error } = await supabase.from("support_features").insert({
    user_id: userId,
    title: finalTitle,
    feature_type: finalType as Enums<"features">,
    description: finalDescription
  });

  if (error) {
    console.error(error);
    throw error;
  }

  revalidatePath("/", "layout");
}
