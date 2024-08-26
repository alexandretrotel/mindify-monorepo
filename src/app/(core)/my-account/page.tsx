import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import { redirect } from "next/navigation";
import React from "react";
import MyAccountClient from "@/app/(core)/my-account/client/MyAccountClient";
import { getUserTopics } from "@/actions/users";
import { getAvatar } from "@/utils/users";
import type { Tables } from "@/types/supabase";
import { BellRingIcon, CreditCardIcon, LockIcon, SettingsIcon, UserPenIcon } from "lucide-react";

const tabs = [
  {
    key: "profile",
    label: "Compte",
    icon: <UserPenIcon className="h-4 w-4" />,
    disabled: false
  },
  {
    key: "subscription",
    label: "Abonnement",
    icon: <CreditCardIcon className="h-4 w-4" />,
    disabled: true
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: <BellRingIcon className="h-4 w-4" />,
    disabled: true
  },
  {
    key: "security",
    label: "Sécurité",
    icon: <LockIcon className="h-4 w-4" />,
    disabled: false
  },
  {
    key: "settings",
    label: "Paramètres",
    icon: <SettingsIcon className="h-4 w-4" />,
    disabled: false
  }
];

const MyAccount = async () => {
  const supabase = createClient();

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const userId = user?.id as UUID;
  const userMetadata = user?.user_metadata;
  const userEmail = user?.email as string;

  const { data: topicsData } = await supabase.from("topics").select("*");

  const userTopics = await getUserTopics(userId);
  const userPicture = getAvatar(userMetadata);

  return (
    <MyAccountClient
      userId={userId}
      userMetadata={userMetadata}
      topics={topicsData as Tables<"topics">[]}
      userTopics={userTopics}
      userPicture={userPicture}
      tabs={tabs}
      userEmail={userEmail}
    />
  );
};

export default MyAccount;
