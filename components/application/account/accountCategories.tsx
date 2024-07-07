import type { AccountCategory } from "@/types/account/categories";
import AccountSubscription from "@/components/application/account/categories/accountSubscription";
import AccountNotifications from "@/components/application/account/categories/accountNotifications";
import AccountSettings from "@/components/application/account/categories/accountSettings";
import AccountProfile from "@/components/application/account/categories/accountProfile";
import type { UserMetadata } from "@supabase/supabase-js";

export default function AccountCategories({
  userMetadata,
  category
}: Readonly<{
  userMetadata: UserMetadata;
  category: AccountCategory;
}>) {
  if (category === "profile") {
    return <AccountProfile userMetadata={userMetadata} />;
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
