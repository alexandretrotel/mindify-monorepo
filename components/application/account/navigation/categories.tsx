import type { AccountCategory } from "@/types/account/categories";
import AccountSubscription from "@/components/application/account/navigation/categories/subscription";
import AccountNotifications from "@/components/application/account/navigation/categories/notifications";
import AccountSettings from "@/components/application/account/navigation/categories/settings";
import AccountProfile from "@/components/application/account/navigation/categories/profile";
import type { UserMetadata } from "@supabase/supabase-js";
import type { Topics, UserTopics } from "@/types/topics/topics";
import { UUID } from "crypto";

export default function AccountCategories({
  userId,
  userMetadata,
  category,
  topics,
  userTopics
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  category: AccountCategory;
  topics: Topics;
  userTopics: UserTopics;
}>) {
  if (category === "profile") {
    return (
      <AccountProfile
        userId={userId}
        userMetadata={userMetadata}
        topics={topics}
        userTopics={userTopics}
      />
    );
  }

  if (category === "subscription") {
    return <AccountSubscription />;
  }

  if (category === "notifications") {
    return <AccountNotifications />;
  }

  if (category === "settings") {
    return <AccountSettings />;
  }
}
