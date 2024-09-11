"use client";
import "client-only";

import React from "react";
import { hasBeenOnboarded } from "@/actions/onboarding.action";
import { features } from "@/data/features";

export default function OnboardingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [onboarded, setOnboarded] = React.useState(false);

  React.useEffect(() => {
    const fetchOnboardingState = async () => {
      const onboarded = await hasBeenOnboarded();
      setOnboarded(onboarded);
    };

    fetchOnboardingState();
  }, []);

  if (features.onboardingIsVisible && !onboarded) {
    return <React.Fragment>d</React.Fragment>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
