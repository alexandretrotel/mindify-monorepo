import React, { useState, useOptimistic } from "react";
import { Label } from "@/components/ui/label";
import type { Topic, Topics, UserTopics } from "@/types/topics/topics";
import { removeTopic, addTopic } from "@/actions/topics";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";
import Image from "next/image";
import { useTheme } from "next-themes";

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
  const [optimisticUserTopics, setOptimisticUserTopics] = useOptimistic<UserTopics>(userTopics);
  const [isLoading, setIsLoading] = useState<boolean[]>(Array(topics.length).fill(false));

  const { toast } = useToast();
  const { theme } = useTheme();

  const handleTopicClick = async (topicId: number) => {
    setIsLoading((prev) => {
      const next = [...prev];
      next[topicId] = true;
      return next;
    });

    const newOptimisticState = isChecked(optimisticUserTopics, topicId)
      ? optimisticUserTopics.filter((userTopic) => userTopic.topic_id !== topicId)
      : [
          ...optimisticUserTopics,
          {
            user_id: userId,
            topic_id: topicId,
            created_at: new Date()
          }
        ];

    setOptimisticUserTopics(newOptimisticState);

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

      // rollback the optimistic state
      setOptimisticUserTopics(optimisticUserTopics);
    } finally {
      setIsLoading((prev) => {
        const next = [...prev];
        next[topicId] = false;
        return next;
      });
    }
  };

  const setIconColorFromTheme = (theme: string, topic: Topic): string => {
    return theme === "dark" ? (topic.white_icon as string) : (topic.black_icon as string);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="topics" className="text-text text-sm font-medium">
        Intérêts
      </Label>

      <div className="flex flex-wrap items-center gap-2">
        {topics
          ?.toSorted((a, b) => a.name.localeCompare(b.name))
          .map((topic) => (
            <Button
              key={topic.id}
              disabled={isLoading[topic.id]}
              variant={isChecked(optimisticUserTopics, topic.id) ? "default" : "outline"}
              onClick={() => handleTopicClick(topic.id)}
            >
              <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
                <Image
                  src={
                    isChecked(optimisticUserTopics, topic.id)
                      ? (topic.white_icon as string)
                      : setIconColorFromTheme(theme as string, topic)
                  }
                  alt={topic.name}
                  fill={true}
                  objectFit="cover"
                />
              </span>
              {topic.name}
            </Button>
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
