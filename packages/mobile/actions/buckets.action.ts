"use server";

import { supabase } from "@/lib/supabase";

/**
 * Retrieves all file names from a specified folder in a Supabase storage bucket.
 *
 * @param {string} bucket - The name of the bucket from which to retrieve files.
 * @param {string} folder - The folder path within the bucket to list files from.
 * @throws {Error} Throws an error if there is an issue retrieving the files from Supabase.
 * @returns {Promise<string[]>} Returns a promise that resolves to an array of file names.
 */
export async function getAllBucketFiles(bucket: string, folder: string) {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 1000,
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les vidéos");
  }

  const filteredData = data.filter((item) => !item.name.includes(".emptyFolderPlaceholder"));

  const names = filteredData.map((item) => item.name);

  return names;
}
