import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { View } from "react-native";
import { Style } from "twrnc";

export default function Separator({
  style,
  direction = "horizontal",
}: Readonly<{
  style?: Style;
  direction?: "horizontal" | "vertical";
}>) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={[
        colorStyles.borderMutedForeground,
        tw.style(`border-[0.5px]`, direction === "horizontal" ? `w-full` : `h-full`, style),
      ]}
    />
  );
}
