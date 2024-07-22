export type Topic = {
  id: number;
  name: string;
  white_icon?: string;
  black_icon?: string;
  created_at: Date;
};

export type UserTopic = {
  user_id: string;
  topic_id: number;
  created_at: Date;
};

export type Topics = Topic[];

export type UserTopics = UserTopic[];
