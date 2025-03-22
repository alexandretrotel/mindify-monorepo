import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { CheckIcon, MoonIcon, SunIcon, ComputerIcon } from "lucide-react-native";
import HapticPressable from "@/components/ui/haptic-buttons/HapticPressable";
import ThemedText from "@/components/typography/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import tw from "@/lib/tailwind";

export default function ApperanceButton({
  theme,
  children,
}: Readonly<{
  theme: "light" | "dark" | "system";
  children: React.ReactNode;
}>) {
  const {
    theme: themeName,
    colors,
    colorStyles,
    setTheme,
    useSystemTheme,
    setUseSystemTheme,
    systemTheme,
  } = useTheme();

  const borderColorStyle = (() => {
    if (theme === themeName && !useSystemTheme) {
      return { borderColor: colors.primary };
    } else if (theme === "system" && useSystemTheme) {
      return { borderColor: colors.primary };
    } else {
      return colorStyles.border;
    }
  })();

  const backgroundColorStyle = (() => {
    return colorStyles.bgCard;
  })();

  const textColorStyle = (() => {
    return colorStyles.textCardForeground;
  })();

  const checkIconColor = (() => {
    if (theme === themeName && !useSystemTheme) {
      return colors.primary;
    } else if (useSystemTheme && theme === "system") {
      return colors.primary;
    } else {
      return "transparent";
    }
  })();

  const iconColor = (() => {
    return colors.foreground;
  })();

  const renderIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon size={20} color={iconColor} />;
      case "dark":
        return <MoonIcon size={20} color={iconColor} />;
      case "system":
        return <ComputerIcon size={20} color={iconColor} />;
      default:
        return null;
    }
  };

  const handleChangeTheme = () => {
    if (theme === "system") {
      setTheme(systemTheme);
      setUseSystemTheme(true);
      AsyncStorage.setItem("systemTheme", "true");
      AsyncStorage.setItem("theme", systemTheme ?? "light");
    } else {
      setTheme(theme);
      setUseSystemTheme(false);
      AsyncStorage.setItem("systemTheme", "false");
      AsyncStorage.setItem("theme", theme);
    }
  };

  return (
    <HapticPressable
      style={[
        borderColorStyle,
        backgroundColorStyle,
        tw`flex-row justify-between items-center px-4 py-3 rounded-lg border`,
      ]}
      onPress={handleChangeTheme}
      event="user_changed_theme"
      eventProps={{ theme }}>
      <View style={tw`flex-row gap-4 items-center`}>
        {renderIcon()}
        <ThemedText style={[textColorStyle, tw`text-base`]} semibold>
          {children}
        </ThemedText>
      </View>
      <CheckIcon size={24} color={checkIconColor} />
    </HapticPressable>
  );
}
