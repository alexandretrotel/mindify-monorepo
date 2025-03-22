import { getUserTopics } from "@/actions/users.action";
import type { UUID } from "crypto";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import Semibold from "@/components/typography/semibold";
import { Muted } from "@/components/typography/muted";
import ProfileTopic from "@/components/features/profile/header/client/ProfileTopic";

const ProfileTopics = async ({ userId, userName }: { userId: UUID; userName: string }) => {
  const topics = await getUserTopics(userId);

  const sortedTopics = [...topics]?.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Dialog>
      <DialogTrigger className="text-left">
        <Muted size="sm">
          <Semibold>{topics.length}</Semibold> intérêt{topics.length > 1 && "s"}
        </Muted>
      </DialogTrigger>

      <DialogContent className="max-w-xs md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">Intérêts</DialogTitle>
          <DialogDescription className="text-left">
            {userName} a <Semibold>{topics.length}</Semibold> intérêt{topics.length > 1 && "s"}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {sortedTopics?.map((topic) => <ProfileTopic key={topic.id} topic={topic} />)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileTopics;
