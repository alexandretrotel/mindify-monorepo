import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";
import MyAccountClient from "./client/MyAccountClient";
import { getUserCustomAvatar, getUserTopics } from "@/actions/users";
import type { Tables } from "@/types/supabase";

export type Tab = "profile" | "subscriptions" | "notifications" | "settings";

const MyAccount = async ({ searchParams }: { searchParams: { tab: string | undefined } }) => {
  const tab = searchParams?.tab as Tab;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const userId = data?.user?.id as UUID;
  const userMetadata = data?.user?.user_metadata;

  const { data: topicsData } = await supabase.from("topics").select("*");

  const userTopics = await getUserTopics(userId);
  const userPicture = await getUserCustomAvatar(userId, userMetadata);

  return (
    <MyAccountClient
      userId={userId}
      userMetadata={userMetadata}
      topics={topicsData as Tables<"topics">[]}
      userTopics={userTopics}
      userPicture={userPicture}
      initialTab={tab}
    />
  );
};

export default MyAccount;
