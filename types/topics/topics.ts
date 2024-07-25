export type Topic = {
  id: number;
  name: string;
  slug: string;
  black_icon?: string;
  white_icon?: string;
  created_at: Date;
};

export type Topics = Topic[];
