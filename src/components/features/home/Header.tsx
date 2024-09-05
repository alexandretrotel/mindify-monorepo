import { createClient } from "@/utils/supabase/server";
import HeaderClient from "@/components/features/home/client/HeaderClient";

export default async function Header() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  const isUserConnected = !error && !!data?.user;

  return <HeaderClient isUserConnected={isUserConnected} />;
}
