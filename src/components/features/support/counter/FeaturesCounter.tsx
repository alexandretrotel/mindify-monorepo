import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";

export default async function FeaturesCounter({
  userId,
  isConnected
}: Readonly<{ userId: UUID; isConnected: boolean }>) {
  if (!isConnected) {
    return null;
  }

  const supabase = createClient();

  const { count, error } = await supabase
    .from("support_features")
    .select("*", {
      count: "exact",
      head: true
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le nombre de bugs signalés.");
  }

  return (
    <Muted size="xs">
      Actuellement, vous avez proposé <Semibold>{count}</Semibold> fonctionnalité
      {(count as number) > 1 ? "s" : ""}. {(count as number) > 0 ? "Merci !" : ""}
    </Muted>
  );
}
