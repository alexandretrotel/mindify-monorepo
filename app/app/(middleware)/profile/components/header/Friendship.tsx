import { UUID } from "crypto";
import FriendshipClient from "@/app/app/(middleware)/profile/components/header/client/FriendshipClient";
import { getFriendStatus } from "@/actions/friends";

const Friendship = async ({ userId, profileId }: { userId: UUID; profileId: UUID }) => {
  const friendStatus = await getFriendStatus({ userId, profileId });

  return (
    <FriendshipClient userId={userId} profileId={profileId} initialFriendStatus={friendStatus} />
  );
};

export default Friendship;
