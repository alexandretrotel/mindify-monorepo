export type Topic = {
  id: number;
  name: string;
  created_at: Date;
};

export type UserTopic = {
  user_id: string;
  topic_id: number;
  created_at: Date;
};

export type Topics = Topic[];

export type UserTopics = UserTopic[];
