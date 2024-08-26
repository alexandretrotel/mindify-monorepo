import AccountSubscription from "@/components/features/account/sections/Subscription";
import AccountNotifications from "@/components/features/account/sections/Notifications";
import AccountSettings from "@/components/features/account/sections/Settings";
import AccountProfile from "@/components/features/account/sections/Profile";
import type { UserMetadata } from "@supabase/supabase-js";
import { UUID } from "crypto";
import type { Tables } from "@/types/supabase";
import AccountSecurity from "@/components/features/account/sections/Security";

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
    return <AccountSecurity />;
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
