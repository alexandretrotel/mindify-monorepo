import { UUID } from "crypto";
import ClientFriendship from "@/app/app/(middleware)/profile/components/header/client/ClientFriendship";
import { getFriendStatus } from "@/actions/friends";

const Friendship = async ({ userId, profileId }: { userId: UUID; profileId: UUID }) => {
  const friendStatus = await getFriendStatus({ userId, profileId });

  return (
    <ClientFriendship userId={userId} profileId={profileId} initialFriendStatus={friendStatus} />
  );
};

export default Friendship;
