import React from "react";
import type { UUID } from "crypto";
import type { Topics } from "@/types/topics";
import { getUserTopics } from "@/actions/topics";
import { createClient } from "@/utils/supabase/server";
import ClientAccountDropdown from "@/components/global/client/AccountDropdownClient";
import { getUserCustomAvatar } from "@/actions/users";

const AccountDropdown = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (!error && data?.user) {
    const userId = data?.user.id as UUID;
    const userMetadata = data?.user?.user_metadata;

    const { data: topicsData } = await supabase.from("topics").select("*");
    const topics: Topics = topicsData as Topics;

    const userTopics = await getUserTopics(userId);
    const userPicture = await getUserCustomAvatar();

    return (
      <ClientAccountDropdown
        userMetadata={userMetadata}
        userId={userId}
        topics={topics}
        userTopics={userTopics}
        userPicture={userPicture}
      />
    );
  }
};

export default AccountDropdown;
