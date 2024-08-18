import React from "react";
import type { UUID } from "crypto";
import { getUserTopics, getUserCustomAvatar } from "@/actions/users";
import { createClient } from "@/utils/supabase/server";
import AccountDropdownClient from "@/components/global/client/AccountDropdownClient";
import type { Tables } from "@/types/supabase";
import { UserMetadata } from "@supabase/supabase-js";

const AccountDropdown = async ({
  userId,
  userMetadata
}: {
  userId: UUID;
  userMetadata: UserMetadata;
}) => {
  const supabase = createClient();

  const { data: topicsData } = await supabase.from("topics").select("*");

  const userTopics = await getUserTopics(userId);
  const userPicture = await getUserCustomAvatar(userId, userMetadata);

  return (
    <AccountDropdownClient
      userMetadata={userMetadata}
      userId={userId}
      topics={topicsData as Tables<"topics">[]}
      userTopics={userTopics}
      userPicture={userPicture}
    />
  );
};

export default AccountDropdown;
