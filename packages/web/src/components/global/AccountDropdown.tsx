import React from "react";
import type { UUID } from "crypto";
import { getAvatar } from "@/utils/users";
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
  const userPicture = getAvatar(userMetadata);

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
