import React from "react";
import type { UUID } from "crypto";
import { getUserTopics, getUserCustomAvatar } from "@/actions/users";
import { createClient } from "@/utils/supabase/server";
import ClientAccountDropdown from "@/components/global/client/AccountDropdownClient";
import type { Tables } from "@/types/supabase";

const AccountDropdown = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    const userId = data?.user.id as UUID;
    const userMetadata = data?.user?.user_metadata;

    const { data: topicsData } = await supabase.from("topics").select("*");

    const userTopics = await getUserTopics(userId);
    const userPicture = await getUserCustomAvatar();

    return (
      <ClientAccountDropdown
        userMetadata={userMetadata}
        userId={userId}
        topics={topicsData as Tables<"topics">[]}
        userTopics={userTopics}
        userPicture={userPicture}
      />
    );
  }
};

export default AccountDropdown;
