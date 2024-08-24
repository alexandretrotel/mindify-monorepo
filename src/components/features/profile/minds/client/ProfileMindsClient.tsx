import Mind from "@/components/global/Mind";
import type { Tables } from "@/types/supabase";
import type { UUID } from "crypto";
import React from "react";

const ProfileMindsClient = ({
  minds,
  initialAreSaved,
  userId,
  isConnected
}: {
  minds: (Tables<"minds"> & {
    summaries: Tables<"summaries"> & {
      authors: Tables<"authors">;
      topics: Tables<"topics">;
    };
  })[];
  initialAreSaved: boolean[];
  userId: UUID;
  isConnected: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {minds?.map((mind, index) => {
        return (
          <Mind
            key={mind.id}
            mind={mind}
            initialIsSaved={initialAreSaved[index]}
            userId={userId}
            isConnected={isConnected}
          />
        );
      })}
    </div>
  );
};

export default ProfileMindsClient;
