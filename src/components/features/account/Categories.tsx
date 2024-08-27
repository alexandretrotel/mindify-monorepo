import AccountSubscription from "@/components/features/account/tabs/Subscription";
import AccountNotifications from "@/components/features/account/tabs/Notifications";
import AccountSettings from "@/components/features/account/tabs/Settings";
import AccountProfile from "@/components/features/account/tabs/Profile";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import AccountSecurity from "@/components/features/account/tabs/Security";

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
  category: string;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
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

  if (category === "security") {
    return <AccountSecurity userId={userId} />;
  }

  if (category === "settings") {
    return <AccountSettings />;
  }

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
