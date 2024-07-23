import React, { useOptimistic } from "react";
import { Label } from "@/components/ui/label";
import type { Topic, Topics, UserTopics } from "@/types/topics/topics";
import { removeTopic, addTopic } from "@/actions/topics";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";
import Image from "next/image";
import { useTheme } from "next-themes";

const isChecked = (userTopics: UserTopics, topicId: number): boolean => {
  return userTopics.some((userTopic) => userTopic.topic_id === topicId);
};

const setIconColorFromTheme = (theme: string, topic: Topic, invert: boolean): string => {
  if (invert) {
    return theme === "dark" ? (topic.black_icon as string) : (topic.white_icon as string);
  } else {
    return theme === "dark" ? (topic.white_icon as string) : (topic.black_icon as string);
  }
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
  const [optimisticUserTopics, setOptimisticUserTopics] = useOptimistic<UserTopics, number>(
    userTopics,
    (state, topicId) => {
      if (isChecked(state, topicId)) {
        return state.filter((userTopic) => userTopic.topic_id !== topicId);
      } else {
        return [
          ...state,
          {
            user_id: userId,
            topic_id: topicId,
            created_at: new Date()
          }
        ];
      }
    }
  );

  const { toast } = useToast();
  const { resolvedTheme } = useTheme();

  const handleTopicClick = async (topicId: number) => {
    setOptimisticUserTopics(topicId);

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
    }
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
              variant={isChecked(optimisticUserTopics, topic.id) ? "default" : "outline"}
              onClick={() => handleTopicClick(topic.id)}
            >
              <span className="relative mr-2 h-3 w-3 flex-shrink-0 overflow-hidden">
                <Image
                  src={
                    isChecked(optimisticUserTopics, topic.id)
                      ? setIconColorFromTheme(resolvedTheme as string, topic, true)
                      : setIconColorFromTheme(resolvedTheme as string, topic, false)
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
