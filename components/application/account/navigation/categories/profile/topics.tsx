import React, { useOptimistic, useState } from "react";
import { Label } from "@/components/ui/label";
import type { Topics, UserTopics } from "@/types/topics/topics";
import { removeTopic, addTopic } from "@/actions/topics";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Loader2Icon } from "lucide-react";
import { setIconColorFromTheme } from "@/utils/theme/icon";

const isChecked = (userTopics: UserTopics, topicId: number): boolean => {
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
  const [isLoading, setIsLoading] = useState(Array.from({ length: topics.length }, () => false));
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

  const sortedTopics = [...topics]?.sort((a, b) => a.name.localeCompare(b.name));

  const handleTopicClick = async (topicId: number) => {
    setIsLoading((prev) => {
      const newState = [...prev];
      newState[topicId] = true;
      return newState;
    });

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
    } finally {
      setIsLoading((prev) => {
        const newState = [...prev];
        newState[topicId] = false;
        return newState;
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="topics" className="text-text flex items-center gap-2 text-sm font-medium">
        Intérêts
        {isLoading?.some((loading) => loading) && <Loader2Icon className="h-3 w-3 animate-spin" />}
      </Label>

      <div className="flex flex-wrap items-center gap-2">
        {sortedTopics?.map((topic) => (
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
                className="object-cover"
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
