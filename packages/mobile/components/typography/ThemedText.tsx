import React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { Style } from "twrnc";

interface ThemedTextProps {
  children: React.ReactNode;
  style?: Style | Style[];
  semibold?: boolean;
  bold?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

export default function ThemedText({
  children,
  style,
  semibold = false,
  bold = false,
  numberOfLines,
  ellipsizeMode,
}: Readonly<ThemedTextProps>) {
  const { colorStyles } = useTheme();

  const getTextStyle = () => {
    if (semibold) {
      return styles.semiboldText;
    }

    if (bold) {
      return styles.boldText;
    }

    return styles.text;
  };

  const getColorStyle = () => {
    if (style) {
      return style;
    }

    return colorStyles.textForeground;
  };

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[getTextStyle(), getColorStyle(), style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Inter_400Regular",
  },
  semiboldText: {
    fontFamily: "Inter_600SemiBold",
  },
  boldText: {
    fontFamily: "Inter_700Bold",
  },
});
