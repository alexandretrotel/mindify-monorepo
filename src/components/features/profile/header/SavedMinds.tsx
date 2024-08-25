import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import React from "react";

const SavedMinds = async ({ userId }: { userId: UUID }) => {
  const supabase = createClient();

  const { data: savedMinds } = await supabase.from("saved_minds").select("*").eq("user_id", userId);

  const savedMindsCount = savedMinds?.length ?? 0;

  return (
    <Muted size="sm">
      <Semibold>{savedMindsCount}</Semibold> MIND{savedMindsCount > 1 && "S"}
    </Muted>
  );
};

export default SavedMinds;
