"use client";
import "client-only";

import Account from "@/components/global/Account";
import React from "react";
import type { UserMetadata } from "@supabase/supabase-js";
import type { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import { useSearchParams } from "next/navigation";

const MyAccountClient = ({
  userId,
  userMetadata,
  topics,
  userTopics,
  userPicture,
  tabs
}: {
  userId: UUID;
  userMetadata: UserMetadata;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
  userPicture: string;
  tabs: {
    key: string;
    label: string;
    icon: JSX.Element;
    disabled: boolean;
  }[];
}) => {
  const searchParams = useSearchParams();
  let tab = searchParams?.get("tab") as string | undefined;
  if (!tabs.some((t) => t.key === tab)) {
    tab = tabs[0].key;
  }
  const initialTab = tab ?? tabs[0].key;

  const [category, setCategory] = React.useState<string>(initialTab);

  React.useEffect(() => {
    if (!tabs.some((t) => t.key === category)) {
      setCategory(tabs[0].key);
    }
  }, [tabs]);

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
