import React from "react";
import type { UUID } from "crypto";
import { getUserCustomAvatar } from "@/actions/users";
import AccountDropdownClient from "@/components/global/client/AccountDropdownClient";
import { UserMetadata } from "@supabase/supabase-js";

const AccountDropdown = async ({
  userId,
  userMetadata
}: {
  userId: UUID;
  userMetadata: UserMetadata;
}) => {
  const userPicture = await getUserCustomAvatar(userId, userMetadata);

  return (
    <AccountDropdownClient userMetadata={userMetadata} userId={userId} userPicture={userPicture} />
  );
};

export default AccountDropdown;
