"use client";
import "client-only";

import React from "react";
import { hasBeenOnboarded } from "@/actions/onboarding.action";
import { features } from "@/data/features";
import type { UUID } from "crypto";
import { getUserId } from "@/actions/users.action";

export default function OnboardingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [onboarded, setOnboarded] = React.useState(false);
  const [userId, setUserId] = React.useState<UUID | undefined>(undefined);

  React.useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      setUserId(userId);
    };

    fetchUserId();
  }, []);

  React.useEffect(() => {
    const fetchOnboardingState = async () => {
      const onboarded = await hasBeenOnboarded(userId as UUID);
      setOnboarded(onboarded);
    };

    if (userId) {
      fetchOnboardingState();
    }
  }, [userId]);

  if (features.onboardingIsVisible && !onboarded) {
    return <React.Fragment>d</React.Fragment>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
