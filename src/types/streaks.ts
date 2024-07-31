export type Streak = {
  currentStreak: number;
  longestStreak: number;
  streaks: number[];
  todayInStreak: boolean;
  withinCurrentStreak: boolean;
};

export type Streaks = Streak[];
