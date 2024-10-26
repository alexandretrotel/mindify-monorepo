import { Muted } from "@/components/typography/muted";
import Semibold from "@/components/typography/semibold";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/server";
import type { UUID } from "crypto";
import React from "react";

const SavedMinds = async ({ userId, userName }: { userId: UUID; userName: string }) => {
  const supabase = await createClient();

  const { count: savedMindsCount } = await supabase
    .from("saved_minds")
    .select("*, minds(production)", { count: "exact", head: true })
    .match({ user_id: userId, "minds.production": true });

  return (
    <Dialog>
      <DialogTrigger>
        <Muted size="sm">
          <Semibold>{savedMindsCount ?? 0}</Semibold> MIND{(savedMindsCount as number) > 1 && "S"}
        </Muted>
      </DialogTrigger>

      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">MINDS sauvegardés</DialogTitle>

          <DialogDescription className="text-left">
            {userName} a sauvegardé <Semibold>{savedMindsCount}</Semibold> MIND
            {(savedMindsCount as number) > 1 && "S"} jusqu&apos;à présent.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SavedMinds;
