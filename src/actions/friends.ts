"use server";
import "server-only";

import { createClient } from "@/utils/supabase/server";
import { UUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getUsersData } from "@/actions/users";
import { createAdminClient } from "@/utils/supabase/admin";
import type { FriendStatus } from "@/types/friends";

export async function askForFriend(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    if (userId === profileId) {
      throw new Error("Impossible de s'ajouter soi-même en ami.");
    }

    await supabase.from("friends").insert({
      user_id: userId,
      friend_id: profileId
    });
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'envoyer la demande d'ami.");
  }

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
  return { message: "Demande d'ami annulée avec succès." };
}

export async function acceptFriendRequest(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    await supabase.from("friends").upsert({
      user_id: userId,
      friend_id: profileId
    });
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'accepter la demande d'ami.");
  }

  revalidatePath("/", "layout");
  return { message: "Demande d'ami acceptée avec succès." };
}

export async function rejectFriendRequest(userId: UUID, profileId: UUID) {
  const supabase = createClient();

  try {
    await supabase.from("friends").delete().eq("user_id", profileId).eq("friend_id", userId);
    await supabase.from("friends").delete().eq("user_id", userId).eq("friend_id", profileId);
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de rejeter la demande d'ami.");
  }

  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
  return { message: "Ami supprimé avec succès." };
}

export async function getFriendsIds(userId: UUID) {
  const supabaseAdmin = createAdminClient();

  const { data: userToFriendData, error: userToFriendError } = await supabaseAdmin
    .from("friends")
    .select("friend_id")
    .eq("user_id", userId);

  if (userToFriendError) {
    console.error(userToFriendError);
    throw new Error("Impossible de récupérer les amis.");
  }

  const { data: friendToUserData, error: friendToUserError } = await supabaseAdmin
    .from("friends")
    .select("user_id")
    .eq("friend_id", userId);

  if (friendToUserError) {
    console.error(friendToUserError);
    throw new Error("Impossible de récupérer les amis.");
  }

  const friendsIds = userToFriendData
    ?.flatMap((friend) => friend?.friend_id)
    ?.filter(
      (friendId) =>
        friendId !== userId && friendToUserData?.some((friend) => friend?.user_id === friendId)
    ) as UUID[];

  return friendsIds;
}

export async function getPendingFriendsIds(userId: UUID) {
  const supabase = createClient();

  const { data, error } = await supabase.from("friends").select("user_id").eq("friend_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis en attente.");
  }

  const pendingFriendsIds = data.flatMap((friend) => friend.user_id) as UUID[];

  return pendingFriendsIds;
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
    .select("*")
    .eq("user_id", userId)
    .eq("friend_id", profileId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le statut de l'ami.");
  }

  let friendStatus: FriendStatus = "none";

  if (data?.length === 1) {
    friendStatus = "pending";
  }

  if (data?.length > 1) {
    friendStatus = "accepted";
  }

  return friendStatus;
}
