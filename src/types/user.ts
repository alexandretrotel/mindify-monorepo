import { UUID } from "crypto";

export type FriendStatus = "pending" | "accepted" | "blocked";

export type UserFriend = {
  user_id: UUID;
  friend_id: UUID;
  status: FriendStatus;
  created_at: Date;
};

export type UserFriends = UserFriend[];

export type UserRating = {
  id: number;
  user_id: UUID;
  summary_id: number;
  rating: number;
  created_at: Date;
};

export type UserRatings = UserRating[];

export type UserRead = {
  id: number;
  user_id: UUID;
  summary_id: number;
  read_at: Date;
  created_at: Date;
};

export type UserReads = UserRead[];

export type UserLibraryItem = {
  id: number;
  user_id: UUID;
  summary_id: number;
  created_at: Date;
};

export type UserLibrary = UserLibraryItem[];

export type UserTopic = {
  user_id: UUID;
  topic_id: number;
  created_at: Date;
};

export type UserTopics = UserTopic[];
