"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getUsersData } from "@/actions/user";
import { friendStatus } from "@/types/user";

export async function askForFriend({ userId, profileId }: { userId: UUID; profileId: UUID }) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_friends").insert({
    user_id: userId,
    friend_id: profileId,
    status: "pending"
  });

  if (error) {
    console.error(error);
    throw new Error("Impossible d'envoyer la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami envoyée avec succès." };
}

export async function acceptFriendRequest({
  userId,
  profileId
}: {
  userId: UUID;
  profileId: UUID;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_friends")
    .update({ status: "accepted" })
    .eq("user_id", profileId)
    .eq("friend_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Impossible d'accepter la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami acceptée avec succès." };
}

export async function rejectFriendRequest({
  userId,
  profileId
}: {
  userId: UUID;
  profileId: UUID;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_friends")
    .delete()
    .eq("user_id", profileId)
    .eq("friend_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de rejeter la demande d'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Demande d'ami rejetée avec succès." };
}

export async function removeFriend({ userId, profileId }: { userId: UUID; profileId: UUID }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_friends")
    .delete()
    .eq("user_id", userId)
    .eq("friend_id", profileId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de supprimer l'ami.");
  }

  revalidatePath(`/app/profile/${profileId}`);
  return { message: "Ami supprimé avec succès." };
}

export async function blockUser({ userId, profileId }: { userId: UUID; profileId: UUID }) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_friends").upsert({
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

export async function unblockUser({ userId, profileId }: { userId: UUID; profileId: UUID }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_friends")
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

export async function getFriendRequests({ userId }: { userId: UUID }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_friends")
    .select("friend_id")
    .eq("user_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les demandes d'ami.");
  }

  return data;
}

export async function getFriendsIds({ userId }: { userId: UUID }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_friends")
    .select("friend_id")
    .eq("user_id", userId)
    .eq("status", "accepted");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis.");
  }

  const friendsIds = data.flatMap((friend) => friend.friend_id) as UUID[];

  return friendsIds;
}

export async function getPendingFriendsIds({ userId }: { userId: UUID }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_friends")
    .select("friend_id")
    .eq("user_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis en attente.");
  }

  const pendingFriendsIds = data.flatMap((friend) => friend.friend_id) as UUID[];

  return pendingFriendsIds;
}

export async function isFriend({ userId, profileId }: { userId: UUID; profileId: UUID }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_friends")
    .select("status")
    .eq("user_id", userId)
    .eq("friend_id", profileId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de vérifier si l'utilisateur est un ami.");
  }

  return data?.[0]?.status === "accepted";
}

export async function getFriendsData({ userId }: { userId: UUID }) {
  const friendsIds = await getFriendsIds({ userId });

  const friendsData = getUsersData({ usersIds: friendsIds });

  return friendsData;
}

export async function getPendingFriendsData({ userId }: { userId: UUID }) {
  const pendingFriendsIds = await getPendingFriendsIds({ userId });

  const pendingFriendsData = getUsersData({ usersIds: pendingFriendsIds });

  return pendingFriendsData;
}

export async function getFriendStatus({ userId, profileId }: { userId: UUID; profileId: UUID }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_friends")
    .select("status")
    .eq("user_id", userId)
    .eq("friend_id", profileId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le statut de l'ami.");
  }

  return data?.[0]?.status as friendStatus;
}
