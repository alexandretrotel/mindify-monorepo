import { usePostHog } from "posthog-react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * A hook that handles the user's data collection preferences.
 *
 * @returns The toggle handler and the opted out state.
 */
export default function useCollectData() {
  const [optedOut, setOptedOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  const posthog = usePostHog();

  useEffect(() => {
    if (posthog.optedOut && !mounted) {
      setOptedOut(posthog.optedOut);
    }

    setMounted(true);
  }, [mounted, posthog]);

  const handleOptOut = async () => {
    if (!mounted) {
      return;
    }

    try {
      setOptedOut(true);
      await posthog.optOut();
    } catch (error) {
      setOptedOut(false);
      throw error;
    }
  };

  const handeOptIn = async () => {
    if (!mounted) {
      return;
    }

    try {
      setOptedOut(false);
      await posthog.optIn();
    } catch (error) {
      setOptedOut(true);
      throw error;
    }
  };

  const handleToggle = async () => {
    if (!mounted) {
      return;
    }

    try {
      if (optedOut) {
        await handeOptIn();
      } else {
        await handleOptOut();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur s'est produite, réessaye plus tard.");
    }
  };

  return { handleToggle, optedOut, mounted };
}
