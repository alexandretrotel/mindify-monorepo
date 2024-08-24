import React from "react";
import type { UUID } from "crypto";
import { getUserCustomAvatar } from "@/actions/users";
import AccountDropdownClient from "@/components/global/client/AccountDropdownClient";
import { UserMetadata } from "@supabase/supabase-js";

const AccountDropdown = async ({
  userId,
  userMetadata,
  isConnected
}: {
  userId: UUID;
  userMetadata: UserMetadata;
  isConnected: boolean;
}) => {
  const userPicture = await getUserCustomAvatar(userId, userMetadata);

  return (
    <AccountDropdownClient
      userMetadata={userMetadata}
      userId={userId}
      userPicture={userPicture}
      isConnected={isConnected}
    />
  );
};

export default AccountDropdown;
