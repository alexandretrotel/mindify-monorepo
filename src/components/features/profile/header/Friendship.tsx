import { UUID } from "crypto";
import FriendshipClient from "@/components/features/profile/header/client/FriendshipClient";
import { getFriendStatus } from "@/actions/friends";

const Friendship = async ({
  userId,
  profileId,
  size
}: {
  userId: UUID;
  profileId: UUID;
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const friendStatus = await getFriendStatus(userId, profileId);

  return (
    <FriendshipClient
      userId={userId}
      profileId={profileId}
      initialFriendStatus={friendStatus}
      size={size}
    />
  );
};

export default Friendship;
