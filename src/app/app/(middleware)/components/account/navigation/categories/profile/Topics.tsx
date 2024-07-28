import React, { useOptimistic, useState } from "react";
import { Label } from "@/components/ui/label";
import type { Topics } from "@/types/topics";
import { removeTopic, addTopic } from "@/src/actions/topics";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import TypographySpan from "@/components/typography/span";
import { Loader2Icon } from "lucide-react";
import TopicIcon from "@/components/global/TopicIcon";

const isChecked = (userTopics: Topics, topicId: number): boolean => {
  return userTopics.some((userTopic) => userTopic.id === topicId);
};

const Topics = ({
  userId,
  topics,
  userTopics
}: {
  userId: UUID;
  topics: Topics;
  userTopics: Topics;
}) => {
  const [isLoading, setIsLoading] = useState(Array.from({ length: topics.length }, () => false));
  const [optimisticUserTopics, setOptimisticUserTopics] = useOptimistic<Topics, number>(
    userTopics,
    (state, topicId) => {
      if (isChecked(state, topicId)) {
        return state.filter((userTopic) => userTopic.id !== topicId);
      } else {
        return [
          ...state,
          {
            id: topicId,
            name: topics.find((topic) => topic.id === topicId)?.name as string,
            icon: topics.find((topic) => topic.id === topicId)?.black_icon,
            black_icon: topics.find((topic) => topic.id === topicId)?.white_icon,
            created_at: new Date(),
            slug: topics.find((topic) => topic.id === topicId)?.slug as string
          }
        ];
      }
    }
  );

  const { toast } = useToast();

  const sortedTopics = topics ? [...topics]?.sort((a, b) => a.name.localeCompare(b.name)) : [];

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
      <Label htmlFor="topics" className="flex items-center gap-2 text-sm font-medium">
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
            <TopicIcon isChecked={isChecked(optimisticUserTopics, topic.id)} topic={topic} />
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
