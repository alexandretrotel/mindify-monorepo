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

  return (
    <Dialog>
      <DialogTrigger>
        <Muted size="sm">
          <Semibold>{topics.length}</Semibold> intérêt{topics.length > 1 && "s"}
        </Muted>
      </DialogTrigger>

      <DialogContent className="max-w-xs lg:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">Intérêts de {userName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {topics?.map((topic) => (
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
