import React from "react";
import { getFriendsData } from "@/actions/friends";
import { UUID } from "crypto";
import { getUserCustomAvatarFromUserId } from "@/actions/users";
import UserCard from "@/components/global/UserCard";

const Friends = async ({ profileId, userId }: { profileId: UUID; userId: UUID }) => {
  const friends = await getFriendsData(profileId);

  const friendsPicture = await Promise.all(
    friends?.map(async (friend) => {
      const picture = await getUserCustomAvatarFromUserId(friend?.id as UUID);
      return picture;
    }) ?? []
  );

  if (!friends || friends.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-4 text-center text-2xl font-semibold">
        Aucun ami
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {friends
        ?.filter((friend) => friend?.id !== userId)
        ?.map((friend, index) => {
          return <UserCard key={index} user={friend} userPicture={friendsPicture[index]} />;
        })}
    </div>
  );
};

export default Friends;
