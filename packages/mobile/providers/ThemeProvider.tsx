import { Appearance, ColorSchemeName, StyleSheet } from "react-native";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { colors as constantColors } from "@/constants/colors";
import { setStatusBarStyle } from "expo-status-bar";
import { usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = typeof constantColors.light | typeof constantColors.dark;

interface ThemeContextType {
  theme: ColorSchemeName;
  setTheme: (theme: ColorSchemeName) => void;
  colors: Theme;
  colorStyles: Record<string, any>;
  toggleTheme: () => void;
  useSystemTheme: boolean;
  setUseSystemTheme: (value: boolean) => void;
  isLight: boolean;
  systemTheme: ColorSchemeName;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  colors: constantColors.light,
  colorStyles: {},
  toggleTheme: () => {},
  useSystemTheme: true,
  setUseSystemTheme: () => {},
  isLight: true,
  systemTheme: "light",
});

const getInitialTheme = async (): Promise<{ theme: ColorSchemeName; useSystemTheme: boolean }> => {
  const storedTheme = await AsyncStorage.getItem("theme");
  const storedSystemTheme = await AsyncStorage.getItem("systemTheme");
  const systemTheme = Appearance.getColorScheme();

  if (storedSystemTheme === "true" && systemTheme) {
    return { theme: systemTheme, useSystemTheme: true };
  }

  return { theme: storedTheme as ColorSchemeName, useSystemTheme: false };
};

export default function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const systemTheme = Appearance.getColorScheme();

  const [theme, setTheme] = useState<ColorSchemeName>("light");
  const [useSystemTheme, setUseSystemTheme] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeTheme = async () => {
      const { theme: initialTheme, useSystemTheme: initialSystemTheme } = await getInitialTheme();

      setTheme(initialTheme);
      setUseSystemTheme(initialSystemTheme);
      setInitialized(true);
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    const listener = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      if (useSystemTheme && systemTheme && initialized) {
        setTheme(systemTheme);
        AsyncStorage.setItem("theme", systemTheme);
        AsyncStorage.setItem("systemTheme", "true");
      } else {
        setTheme(colorScheme);
        AsyncStorage.setItem("theme", colorScheme ?? "light");
      }
    };

    Appearance.addChangeListener(listener);
  }, [initialized, systemTheme, useSystemTheme]);

  const colors: Theme = theme === "dark" ? constantColors.dark : constantColors.light;
  const isLight = theme === "light";

  const toggleTheme = useCallback(() => {
    setUseSystemTheme(false);
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  }, []);

  const colorStyles = StyleSheet.create({
    bgForeground: {
      backgroundColor: colors.foreground,
    },
    bgBackground: {
      backgroundColor: colors.background,
    },
    bgTransparent: {
      backgroundColor: "transparent",
    },
    bgPrimary: {
      backgroundColor: colors.primary,
    },
    bgSecondary: {
      backgroundColor: colors.secondary,
    },
    bgMuted: {
      backgroundColor: colors.muted,
    },
    bgCard: {
      backgroundColor: colors.card,
    },
    bgDestructive: {
      backgroundColor: colors.destructive,
    },
    textForeground: {
      color: colors.foreground,
    },
    textBackground: {
      color: colors.background,
    },
    textPrimary: {
      color: colors.primary,
    },
    textTransparent: {
      color: "transparent",
    },
    textSecondary: {
      color: colors.secondary,
    },
    textMuted: {
      color: colors.muted,
    },
    textCard: {
      color: colors.card,
    },
    textWhite: {
      color: "white",
    },
    textBlack: {
      color: "black",
    },
    textDestructiveForeground: {
      color: colors.destructiveForeground,
    },
    textDestructive: {
      color: colors.destructive,
    },
    textPrimaryForeground: {
      color: colors.primaryForeground,
    },
    textSecondaryForeground: {
      color: colors.secondaryForeground,
    },
    textMutedForeground: {
      color: colors.mutedForeground,
    },
    textCardForeground: {
      color: colors.cardForeground,
    },
    borderForeground: {
      borderColor: colors.foreground,
    },
    border: {
      borderColor: colors.border,
    },
    borderMutedForeground: {
      borderColor: colors.border,
    },
    borderCardForeground: {
      borderColor: colors.border,
    },
    borderTransparent: {
      borderColor: "transparent",
    },
    borderPrimary: {
      borderColor: colors.primary,
    },
  });

  const pathname = usePathname();

  const getStatusBarStyle = (theme: ColorSchemeName) => {
    if (theme === "light") {
      return "dark";
    } else {
      return "light";
    }
  };

  React.useEffect(() => {
    const statusBarStyle = getStatusBarStyle(theme);

    if (!pathname) {
      setStatusBarStyle(statusBarStyle);
      return;
    }

    if (pathname === "/") {
      setStatusBarStyle("light");
    } else {
      setStatusBarStyle(statusBarStyle);
    }
  }, [pathname, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      colors,
      colorStyles,
      toggleTheme,
      useSystemTheme,
      setUseSystemTheme,
      isLight,
      systemTheme,
    }),
    [
      theme,
      setTheme,
      colors,
      colorStyles,
      toggleTheme,
      useSystemTheme,
      setUseSystemTheme,
      isLight,
      systemTheme,
    ],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
