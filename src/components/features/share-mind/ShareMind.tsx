import { areMindsSaved } from "@/actions/minds";
import { getAvatar } from "@/utils/users";
import Mind from "@/components/global/Mind";
import Semibold from "@/components/typography/semibold";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Tables } from "@/types/supabase";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import type { User, UserMetadata } from "@supabase/supabase-js";
import type { UUID } from "crypto";
import { UserRoundIcon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const ShareMind = async ({
  mindId,
  isConnected,
  sharedByUserId,
  userId,
  userName
}: {
  mindId: number;
  isConnected: boolean;
  sharedByUserId: UUID;
  userId: UUID;
  userName: string;
}) => {
  const supabase = createClient();

  const { data: mind } = (await supabase
    .from("minds")
    .select("*, summaries(*, authors(*), topics(*))")
    .eq("id", mindId)
    .maybeSingle()) as {
    data:
      | (Tables<"minds"> & {
          summaries: Tables<"summaries"> & { authors: Tables<"authors">; topics: Tables<"topics"> };
        })
      | null;
  };

  if (!mind) {
    notFound();
  }

  const areMindsSavedArray = await areMindsSaved([mind?.id], userId);
  const initialIsSaved = areMindsSavedArray?.[0];

  const supabaseAdmin = createAdminClient();

  let sharedByUser: User | null = null;
  if (sharedByUserId) {
    const {
      data: { user: sharedByUserData }
    } = await supabaseAdmin.auth.admin.getUserById(sharedByUserId);

    if (sharedByUserData) {
      sharedByUser = sharedByUserData;
    }
  }

  const sharedByUserPicture = getAvatar(sharedByUser?.user_metadata as UserMetadata);

  return (
    <div className="flex flex-col gap-4">
      {sharedByUser ? (
        <div className="flex w-full items-end justify-between gap-4">
          <Semibold>Partagé par {sharedByUser?.user_metadata?.name}</Semibold>

          <Avatar className="h-4 w-4">
            <AvatarImage src={sharedByUserPicture} alt={sharedByUser?.user_metadata?.name} />
            <AvatarFallback>
              <UserRoundIcon className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <Semibold>Partagé par un utilisateur inconnu</Semibold>
      )}

      <Mind
        mind={mind}
        userId={userId}
        initialIsSaved={initialIsSaved}
        isConnected={isConnected}
        userName={userName}
      />
    </div>
  );
};

export default ShareMind;
