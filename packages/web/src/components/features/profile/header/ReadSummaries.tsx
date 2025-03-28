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

const ReadSummaries = async ({ userId, userName }: { userId: UUID; userName: string }) => {
  const supabase = await createClient();

  const { count: readSummariesCount } = await supabase
    .from("read_summaries")
    .select("*, minds(production)", { count: "exact", head: true })
    .match({ user_id: userId, "minds.production": true });

  return (
    <Dialog>
      <DialogTrigger>
        <Muted size="sm">
          <Semibold>{readSummariesCount ?? 0}</Semibold> résumé
          {(readSummariesCount as number) > 1 && "s"} lu{(readSummariesCount as number) > 1 && "s"}
        </Muted>
      </DialogTrigger>

      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">Résumés lus</DialogTitle>

          <DialogDescription className="text-left">
            {userName} a lu <Semibold>{readSummariesCount}</Semibold> résumé
            {(readSummariesCount as number) > 1 && "s"} jusqu&apos;à présent.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ReadSummaries;
