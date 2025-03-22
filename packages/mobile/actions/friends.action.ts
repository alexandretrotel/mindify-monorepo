"use server";

import { supabase } from "@/lib/supabase";
import type { FriendStatus } from "@/types/friends";

/**
 * Sends a friend request from one user to another.
 *
 * @param {string} userId - The ID of the user sending the friend request.
 * @param {string} profileId - The ID of the user to whom the friend request is sent.
 * @throws {Error} Throws an error if the user tries to add themselves as a friend or if the request fails.
 * @returns {Promise<{ message: string }>} A promise that resolves to a success message.
 */
export async function askForFriend(userId: string, profileId: string) {
  try {
    if (userId === profileId) {
      throw new Error("Impossible de s'ajouter soi-même en ami.");
    }

    const { error } = await supabase.from("friends").insert({
      user_id: userId,
      friend_id: profileId,
    });

    if (error) {
      console.error(error);
      throw new Error("Impossible d'envoyer la demande d'ami.");
    }

    return { message: "Demande d'ami envoyée avec succès." };
  } catch (error: any) {
    if (error.message === "Impossible de s'ajouter soi-même en ami.") {
      throw error;
    } else {
      console.error(error);
      throw new Error("Impossible d'envoyer la demande d'ami.");
    }
  }
}

/**
 * Cancels a friend request from one user to another.
 *
 * @param {string} userId - The ID of the user cancelling the friend request.
 * @param {string} profileId - The ID of the user whose friend request is being cancelled.
 * @throws {Error} Throws an error if the cancellation fails.
 * @returns {Promise<{ message: string }>} A promise that resolves to a success message.
 */
export async function cancelFriendRequest(userId: string, profileId: string) {
  try {
    const { error } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: userId, friend_id: profileId });

    if (error) {
      console.error(error);
      throw new Error("Impossible d'annuler la demande d'ami.");
    }

    return { message: "Demande d'ami annulée avec succès." };
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'annuler la demande d'ami.");
  }
}

/**
 * Accepts a friend request from another user.
 *
 * @param {string} userId - The ID of the user accepting the friend request.
 * @param {string} profileId - The ID of the user who sent the friend request.
 * @throws {Error} Throws an error if the acceptance fails.
 * @returns {Promise<{ message: string }>} A promise that resolves to a success message.
 */
export async function acceptFriendRequest(userId: string, profileId: string) {
  try {
    const { error } = await supabase.from("friends").upsert({
      user_id: userId,
      friend_id: profileId,
    });

    if (error) {
      console.error(error);
      throw new Error("Impossible d'accepter la demande d'ami.");
    }

    return { message: "Demande d'ami acceptée avec succès." };
  } catch (error) {
    console.error(error);
    throw new Error("Impossible d'accepter la demande d'ami.");
  }
}

/**
 * Rejects a friend request from another user.
 *
 * @param {string} userId - The ID of the user rejecting the friend request.
 * @param {string} profileId - The ID of the user whose request is rejected.
 * @throws {Error} Throws an error if there's an issue with the rejection.
 * @returns {Promise<void>} A promise that resolves when the rejection is complete.
 */
export async function rejectFriendRequest(userId: string, profileId: string) {
  try {
    const { error: errorFirstDelete } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: profileId, friend_id: userId });
    const { error: errorSecondDelete } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: userId, friend_id: profileId });

    if (errorFirstDelete || errorSecondDelete) {
      console.error(errorFirstDelete, errorSecondDelete);
      throw new Error("Impossible de rejeter la demande d'ami.");
    }

    return { message: "Demande d'ami rejetée avec succès." };
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de rejeter la demande d'ami.");
  }
}

/**
 * Removes a friend from the user's friend list.
 *
 * @param {string} userId - The ID of the user removing the friend.
 * @param {string} profileId - The ID of the friend to be removed.
 * @throws {Error} Throws an error if there's an issue with the removal.
 * @returns {Promise<void>} A promise that resolves when the friend is removed.
 */
export async function removeFriend(userId: string, profileId: string) {
  try {
    const { error: errorFirstDelete } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: userId, friend_id: profileId });

    if (errorFirstDelete) {
      console.error(errorFirstDelete);
      throw new Error("Impossible de supprimer l'ami.");
    }

    const { error: errorSecondDelete } = await supabase
      .from("friends")
      .delete()
      .match({ user_id: profileId, friend_id: userId });

    if (errorSecondDelete) {
      console.error(errorSecondDelete);
      throw new Error("Impossible de supprimer l'ami.");
    }

    return { message: "Ami supprimé avec succès." };
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de supprimer l'ami.");
  }
}

/**
 * Retrieves the IDs of all friends for a specified user.
 *
 * @param {string} userId - The ID of the user for whom to retrieve friend IDs.
 * @returns {Promise<{ friendsIds: string[], askedFriendsIds: string[], requestedFriendsIds: string[] }>} A promise that resolves to an object containing arrays of friend IDs, asked friend IDs, and requested friend IDs excluding the user's own ID and duplicates.
 * @throws {Error} Throws an error if there's an issue retrieving friends.
 */
export async function getFriendsIds(userId: string) {
  try {
    const { data: userFriendsData, error: userFriendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", userId);

    if (userFriendsError) {
      console.error(userFriendsError);
      throw new Error("Impossible de récupérer les amis.");
    }

    const {
      data: usersWhoAskedToBeFriendWithCurrentUserData,
      error: userWhoAskedToBeFriendWithCurrentUserError,
    } = await supabase.from("friends").select("user_id").eq("friend_id", userId);

    if (userWhoAskedToBeFriendWithCurrentUserError) {
      console.error(userWhoAskedToBeFriendWithCurrentUserError);
      throw new Error("Impossible de récupérer les amis.");
    }

    const friendsIds = userFriendsData
      ?.flatMap((friend) => friend?.friend_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          usersWhoAskedToBeFriendWithCurrentUserData?.some(
            (friend) => friend?.user_id === friendId,
          ),
      );

    const askedFriendsIds = userFriendsData
      ?.flatMap((friend) => friend?.friend_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          !usersWhoAskedToBeFriendWithCurrentUserData?.some(
            (friend) => friend?.user_id === friendId,
          ),
      );

    const requestedFriendsIds = usersWhoAskedToBeFriendWithCurrentUserData
      ?.flatMap((friend) => friend?.user_id)
      ?.filter(
        (friendId) =>
          friendId !== userId && !userFriendsData?.some((friend) => friend?.friend_id === friendId),
      );

    return { friendsIds, askedFriendsIds, requestedFriendsIds };
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis.");
  }
}

/**
 * Retrieves the IDs of pending friend requests for a specified user.
 *
 * @param {string} userId - The ID of the user for whom to retrieve pending friend request IDs.
 * @returns {Promise<string[]>} A promise that resolves to an array of pending friend request IDs.
 * @throws {Error} Throws an error if there's an issue retrieving pending friends.
 */
export async function getPendingFriendsIds(userId: string) {
  try {
    const { data: userFriendsData, error: userFriendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", userId);

    if (userFriendsError) {
      console.error(userFriendsError);
      throw new Error("Impossible de récupérer les amis en attente.");
    }

    const {
      data: usersWhoAskedToBeFriendWithCurrentUserData,
      error: userWhoAskedToBeFriendWithCurrentUserError,
    } = await supabase.from("friends").select("user_id").eq("friend_id", userId);

    if (userWhoAskedToBeFriendWithCurrentUserError) {
      console.error(userWhoAskedToBeFriendWithCurrentUserError);
      throw new Error("Impossible de récupérer les amis en attente.");
    }

    const pendingFriendsIds = userFriendsData
      ?.flatMap((friend) => friend?.friend_id)
      ?.filter(
        (friendId) =>
          friendId !== userId &&
          !usersWhoAskedToBeFriendWithCurrentUserData?.some(
            (friend) => friend?.user_id === friendId,
          ),
      );

    return pendingFriendsIds;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les amis en attente.");
  }
}

/**
 * Retrieves the friendship status between two users.
 *
 * @param {string} userId - The ID of the user checking the friendship status.
 * @param {string} profileId - The ID of the user whose friendship status is being checked.
 * @returns {Promise<FriendStatus>} A promise that resolves to the friendship status.
 * @throws {Error} Throws an error if there's an issue retrieving the status.
 */
export async function getFriendStatus(userId: string, profileId: string) {
  try {
    const { data: userFriends, error: userFriendsError } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", userId); // we get the people the user asked to be friends with (ex: userFriendsData = [{friend_id: '1'}, {friend_id: '2'}])

    if (userFriendsError) {
      console.error(userFriendsError);
      throw new Error("Impossible de récupérer les amis.");
    }

    const { data: profileFriends, error: userWhoAskedToBeFriendWithCurrentUserError } =
      await supabase.from("friends").select("friend_id").eq("user_id", profileId); // we get the people the profile asked to be friends with (ex: usersWhoAskedToBeFriendWithCurrentUserData = [{friend_id: '1'}, {friend_id: '3'}])

    if (userWhoAskedToBeFriendWithCurrentUserError) {
      console.error(userWhoAskedToBeFriendWithCurrentUserError);
      throw new Error("Impossible de récupérer les amis.");
    }

    let friendStatus: FriendStatus = "none";
    if (
      userFriends?.some((friend) => friend?.friend_id === profileId) &&
      profileFriends?.some((friend) => friend?.friend_id === userId) // if the user and the profile are friends
    ) {
      friendStatus = "accepted";
    } else if (userFriends?.some((friend) => friend?.friend_id === profileId)) {
      // if the user asked to be friends with the profile
      friendStatus = "pending";
    } else if (profileFriends?.some((friend) => friend?.friend_id === userId)) {
      // if the profile asked to be friends with the user
      friendStatus = "requested";
    }

    return friendStatus;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le statut de l'ami.");
  }
}
