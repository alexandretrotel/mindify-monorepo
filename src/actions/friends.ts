"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getUsersData } from "@/actions/users";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function askForFriend(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    if (userId === profileId) {
      throw new Error("Impossible de s'ajouter soi-même en ami.");
    }

    await supabase.from("friends").insert({
      user_id: userId,
      friend_id: profileId,
      status: "pending"
    });
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'envoyer la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami envoyée avec succès." };
}

export async function cancelFriendRequest(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    await supabase.from("friends").delete().eq("user_id", userId).eq("friend_id", profileId);
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'annuler la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami annulée avec succès." };
}

export async function acceptFriendRequest(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("friends")
      .select("status")
      .eq("user_id", profileId)
      .eq("friend_id", userId);

    if (error) {
      console.error(error);
      throw new Error("Impossible d'accepter la demande d'ami.");
    }

    if (data?.[0]?.status !== "pending") {
      throw new Error("La demande d'ami n'existe pas ou a déjà été acceptée.");
    }

    await supabase.from("friends").upsert({
      user_id: userId,
      friend_id: profileId,
      status: "accepted"
    });

    await supabase.from("friends").upsert({
      user_id: profileId,
      friend_id: userId,
      status: "accepted"
    });
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'accepter la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami acceptée avec succès." };
}

export async function rejectFriendRequest(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("friends")
    .select("status")
    .eq("user_id", profileId)
    .eq("friend_id", userId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Impossible de rejeter la demande d'ami.");
  }

  if (data?.status !== "pending") {
    throw new Error("La demande d'ami n'existe pas ou a déjà été acceptée.");
  }

  try {
    await supabase.from("friends").delete().eq("user_id", profileId).eq("friend_id", userId);
    await supabase.from("friends").delete().eq("user_id", userId).eq("friend_id", profileId);
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de rejeter la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami rejetée avec succès." };
}

export async function removeFriend(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    await supabase.from("friends").delete().eq("user_id", userId).eq("friend_id", profileId);
    await supabase.from("friends").delete().eq("user_id", profileId).eq("friend_id", userId);
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de supprimer l'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Ami supprimé avec succès." };
}

export async function blockUser(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  if (userId === profileId) {
    throw new Error("Impossible de se bloquer soi-même.");
  }

  const { error } = await supabase.from("friends").upsert({
    user_id: userId,
    friend_id: profileId,
    status: "blocked"
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible de bloquer l'utilisateur.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Utilisateur bloqué avec succès." };
}

export async function unblockUser(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  const { error } = await supabase
    .from("friends")
    .delete()
    .eq("user_id", userId)
    .eq("friend_id", profileId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de débloquer l'utilisateur.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Utilisateur débloqué avec succès." };
}

export async function getFriendRequests(userId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("user_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les demandes d'ami.");
  }

  return data;
}

export async function getFriendsIds(userId: UUID) {
  const { data, error } = await supabaseAdmin
    .from("friends")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "accepted");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis.");
  }

  const friendsIds = data.flatMap((friend) => friend.friend_id) as UUID[];

  return friendsIds;
}

export async function getPendingFriendsIds(userId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("friends")
    .select("user_id")
    .eq("friend_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis en attente.");
  }

  const pendingFriendsIds = data.flatMap((friend) => friend.user_id) as UUID[];

  return pendingFriendsIds;
}

export async function isFriend(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("friends")
    .select("status")
    .eq("user_id", userId)
    .eq("friend_id", profileId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si l'utilisateur est un ami.");
  }

  return data?.status === "accepted";
}

export async function getFriendsData(userId: UUID) {
  const friendsIds = await getFriendsIds(userId);
  const friendsData = await getUsersData(friendsIds);

  return friendsData;
}

export async function getPendingFriendsData(userId: UUID) {
  const pendingFriendsIds = await getPendingFriendsIds(userId);
  const pendingFriendsData = await getUsersData(pendingFriendsIds);

  return pendingFriendsData;
}

export async function getFriendStatus(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("friends")
    .select("status")
    .eq("user_id", userId)
    .eq("friend_id", profileId)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le statut de l'ami.");
  }

  return data?.status;
}
