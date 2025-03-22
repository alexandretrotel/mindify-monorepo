import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FeedContext = createContext<{
  shouldAnimateText: boolean;
  setShouldAnimateText: (value: boolean) => void;
  handleToggleShouldAnimateText: () => void;
  shouldPlaySound: boolean;
  setShouldPlaySound: (value: boolean) => void;
  handleToggleShouldPlaySound: () => void;
}>({
  shouldAnimateText: true,
  setShouldAnimateText: (value: boolean) => {},
  handleToggleShouldAnimateText: () => {},
  shouldPlaySound: true,
  setShouldPlaySound: (value: boolean) => {},
  handleToggleShouldPlaySound: () => {},
});

export default function FeedProvider({ children }: { children: React.ReactNode }) {
  const [shouldAnimateText, setShouldAnimateText] = useState(true);
  const [shouldPlaySound, setShouldPlaySound] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("shouldAnimateText");
        const storedValueSound = await AsyncStorage.getItem("shouldPlaySound");

        if (storedValue !== null) {
          setShouldAnimateText(JSON.parse(storedValue));
        }

        if (storedValueSound !== null) {
          setShouldPlaySound(JSON.parse(storedValueSound));
        }
      } catch (error) {
        console.error("Failed to load settings from AsyncStorage:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleShouldAnimateText = useCallback(() => {
    setShouldAnimateText((prev) => !prev);
    AsyncStorage.setItem("shouldAnimateText", JSON.stringify(!shouldAnimateText));
  }, [shouldAnimateText]);

  const handleToggleShouldPlaySound = useCallback(() => {
    setShouldPlaySound((prev) => !prev);
    AsyncStorage.setItem("shouldPlaySound", JSON.stringify(!shouldPlaySound));
  }, [shouldPlaySound]);

  const value = useMemo(() => {
    return {
      shouldAnimateText,
      setShouldAnimateText,
      handleToggleShouldAnimateText,
      shouldPlaySound,
      setShouldPlaySound,
      handleToggleShouldPlaySound,
    };
  }, [
    handleToggleShouldAnimateText,
    handleToggleShouldPlaySound,
    shouldAnimateText,
    shouldPlaySound,
  ]);

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export const useFeed = () => {
  const context = useContext(FeedContext);

  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }

  return context;
};
