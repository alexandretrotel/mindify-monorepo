"use client";
import "client-only";

import Account from "@/components/global/Account";
import React from "react";
import type { UserMetadata } from "@supabase/supabase-js";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";

const MyAccountClient = ({
  userId,
  userMetadata,
  topics,
  userTopics,
  userPicture,
  initialTab,
  tabs
}: {
  userId: UUID;
  userMetadata: UserMetadata;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
  initialTab: string;
  tabs: {
    key: string;
    label: string;
    icon: JSX.Element;
    disabled: boolean;
  }[];
}) => {
  const [category, setCategory] = React.useState<string>(initialTab);

  return (
    <Account
      userId={userId}
      userMetadata={userMetadata}
      category={category}
      setCategory={setCategory}
      topics={topics}
      userTopics={userTopics}
      userPicture={userPicture}
      tabs={tabs}
    />
  );
};

export default MyAccountClient;
