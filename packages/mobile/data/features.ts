const isDevelopment = process.env.NODE_ENV === "development";

export const features = {
  canSwipeEntirelyNotifications: false,
  canSeeOnboardingChallenges: !!isDevelopment,
};
