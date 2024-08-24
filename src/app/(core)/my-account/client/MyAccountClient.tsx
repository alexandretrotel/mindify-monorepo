"use client";
import "client-only";

import Account from "@/components/global/Account";
import React from "react";
import type { UserMetadata } from "@supabase/supabase-js";
import type { UUID } from "crypto";
import { AccountCategory } from "@/types/account";
import type { Tables } from "@/types/supabase";
import { Tab } from "@/app/(core)/my-account/page";

const MyAccountClient = ({
  userId,
  userMetadata,
  topics,
  userTopics,
  userPicture,
  initialTab
}: {
  userId: UUID;
  userMetadata: UserMetadata;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
  initialTab?: Tab;
}) => {
  const [category, setCategory] = React.useState<AccountCategory>("profile");

  return (
    <Account
      userId={userId}
      userMetadata={userMetadata}
      category={category}
      setCategory={setCategory}
      topics={topics}
      userTopics={userTopics}
      userPicture={userPicture}
      initialTab={initialTab}
    />
  );
};

export default MyAccountClient;
