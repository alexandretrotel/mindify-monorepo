import type { AccountCategory } from "@/types/account";
import AccountSubscription from "@/app/app/(middleware)/components/account/navigation/categories/Subscription";
import AccountNotifications from "@/app/app/(middleware)/components/account/navigation/categories/Notifications";
import AccountSettings from "@/app/app/(middleware)/components/account/navigation/categories/Settings";
import AccountProfile from "@/app/app/(middleware)/components/account/navigation/categories/Profile";
import type { UserMetadata } from "@supabase/supabase-js";
import type { Topics } from "@/types/topics";
import { UUID } from "crypto";

export default function AccountCategories({
  userId,
  userMetadata,
  category,
  topics,
  userTopics,
  userPicture
}: Readonly<{
  userId: UUID;
  userMetadata: UserMetadata;
  category: AccountCategory;
  topics: Topics;
  userTopics: Topics;
  userPicture: string;
}>) {
  if (category === "profile") {
    return (
      <AccountProfile
        userId={userId}
        userMetadata={userMetadata}
        topics={topics}
        userTopics={userTopics}
        userPicture={userPicture}
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
