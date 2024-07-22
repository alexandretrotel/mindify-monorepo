import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import type { Topics, UserTopics } from "@/types/topics/topics";
import { removeTopic, addTopic } from "@/actions/topics";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/global/buttons/loadingButton";
import { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";

const isChecked = (userTopics: UserTopics, topicId: number) => {
  return userTopics.some((userTopic) => userTopic.topic_id === topicId);
};

const Topics = ({
  userId,
  topics,
  userTopics
}: {
  userId: UUID;
  topics: Topics;
  userTopics: UserTopics;
}) => {
  const [isLoading, setIsLoading] = useState<boolean[]>(Array(topics.length).fill(false));

  const { toast } = useToast();

  const handleTopicClick = async (topicId: number) => {
    setIsLoading((prev) => {
      const next = [...prev];
      next[topicId] = true;
      return next;
    });

    try {
      if (isChecked(userTopics, topicId)) {
        await removeTopic(userId, topicId);
      } else {
        await addTopic(userId, topicId);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur !",
        description: "Impossible de mettre à jour l'intérêt.",
        variant: "destructive"
      });
    } finally {
      setIsLoading((prev) => {
        const next = [...prev];
        next[topicId] = false;
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="topics" className="text-text text-sm font-medium">
        Intérêts
      </Label>

      <div className="flex flex-wrap items-center gap-2">
        {userTopics &&
          topics &&
          topics.map((topic) => (
            <LoadingButton
              key={topic.id}
              disabled={isLoading[topic.id]}
              pending={isLoading[topic.id]}
              variant={isChecked(userTopics, topic.id) ? "default" : "outline"}
              onClick={() => handleTopicClick(topic.id)}
            >
              {topic.name}
            </LoadingButton>
          ))}
      </div>

      <TypographySpan muted size="sm">
        Choisissez les sujets qui vous intéressent afin que nous puissions vous proposer du contenu
        pertinent.
      </TypographySpan>
    </div>
  );
};

export default Topics;
