import { getUserTopics } from "@/actions/users";
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
import { Button } from "@/components/ui/button";

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
          <DialogTitle className="text-left">Intérêts de {userName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {sortedTopics?.map((topic) => (
            <div key={topic.id}>
              <Button size="sm" variant="outline">
                {topic.name}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileTopics;
