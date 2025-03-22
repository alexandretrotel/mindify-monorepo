import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const textWritingDelay: number = 250;
const pauseDuration: number = 5000;

/**
 * A hook that animates text by writing it word by word.
 *
 * @param text The text to animate
 * @param isPaused The pause state
 * @param shouldPlay The play state
 * @param shouldAnimateText The state that determines if the text should be animated
 * @returns The animated text
 */
const useAnimatedText = (
  text: string,
  isPaused: boolean,
  shouldPlay: boolean,
  shouldAnimateText: boolean,
) => {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(" "));
  }, [text]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (shouldPlay && !isPaused && currentWordIndex < words.length) {
      timeout = setTimeout(() => {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }, textWritingDelay);
    } else {
      timeout = setTimeout(() => {
        setCurrentWordIndex(0);
      }, pauseDuration);
    }

    return () => clearTimeout(timeout);
  }, [currentWordIndex, isPaused, words, shouldPlay]);

  const getStyledText = () => {
    if (!shouldAnimateText) {
      return (
        <ThemedText style={styles.paragraph}>
          <ThemedText bold style={[styles.shadowText, { color: "white" }, tw`text-xl`]}>
            {text}
          </ThemedText>
        </ThemedText>
      );
    }

    return (
      <ThemedText style={styles.paragraph}>
        {words.map((word, index) => (
          <ThemedText
            key={index}
            bold
            style={[
              styles.shadowText,
              {
                color: "white",
              },
              {
                opacity: index < currentWordIndex ? 1 : 0.4,
              },
              tw`text-xl`,
            ]}>
            {word}{" "}
          </ThemedText>
        ))}
      </ThemedText>
    );
  };

  return { getStyledText, words, currentWordIndex };
};

const styles = StyleSheet.create({
  paragraph: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  shadowText: {
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
});

export default useAnimatedText;
