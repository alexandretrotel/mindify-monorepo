export type Topic = {
  id: number;
  name: string;
  white_icon?: string;
  black_icon?: string;
  created_at: Date;
  slug: string;
};

export type Topics = Topic[];
