import type { Json } from "@/types/supabase";

/**
 * Represents a friend entity with its details.
 *
 * @typedef {Object} Friend
 * @property {string} friend_id - The unique identifier of the friend.
 * @property {string} created_at - The timestamp when the friendship was created.
 * @property {Json} raw_user_meta_data - Metadata associated with the user in JSON format.
 */
export type Friend = {
  friend_id: string;
  created_at: string;
  raw_user_meta_data: Json;
};

/**
 * Represents an array of Friend objects.
 *
 * @typedef {Friend[]} Friends
 */
export type Friends = Friend[];

/**
 * Represents the possible statuses of a friendship.
 *
 * @typedef {("pending" | "requested" | "accepted" | "rejected" | "blocked" | "none")} FriendStatus
 */
export type FriendStatus = "pending" | "requested" | "accepted" | "rejected" | "blocked" | "none";
