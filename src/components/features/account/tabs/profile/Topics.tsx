import React, { useOptimistic, useState } from "react";
import { Label } from "@/components/ui/label";
import { removeTopic, addTopic } from "@/actions/topics.action";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import { Loader2Icon } from "lucide-react";
import TopicIcon from "@/components/global/TopicIcon";
import type { Tables } from "@/types/supabase";
import { Muted } from "@/components/typography/muted";

const isChecked = (userTopics: Tables<"topics">[], topicId: number): boolean => {
  return userTopics?.some((userTopic: { id: number }) => userTopic.id === topicId);
};

const Topics = ({
  userId,
  topics,
  userTopics
}: {
  userId: UUID;
  topics: Tables<"topics">[];
  userTopics: Tables<"topics">[];
}) => {
  const [isLoading, setIsLoading] = useState(
    Array.from({ length: topics.length ?? 0 }, () => false)
  );
  const [optimisticUserTopics, setOptimisticUserTopics] = useOptimistic<Tables<"topics">[], number>(
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
            black_icon: topics.find((topic) => topic.id === topicId)?.black_icon ?? null,
            white_icon: topics.find((topic) => topic.id === topicId)?.white_icon ?? null,
            created_at: new Date().toISOString(),
            slug: topics.find((topic) => topic.id === topicId)?.slug as string,
            emoji: topics.find((topic) => topic.id === topicId)?.emoji ?? null
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

      <Muted size="sm">
        Choisissez les sujets qui vous intéressent afin que nous puissions vous proposer du contenu
        pertinent.
      </Muted>
    </div>
  );
};

export default Topics;
