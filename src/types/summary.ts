export type Source = "book" | "article" | "podcast" | "video";

export type SummaryStatus = "completed" | "saved" | "not_started";

export type SummaryStatusWithValue = {
  id: number;
  name: string;
  value: SummaryStatus;
};

export type SummaryStatusesWithValue = SummaryStatusWithValue[];
