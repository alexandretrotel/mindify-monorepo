import { useTheme } from "@/providers/ThemeProvider";
import { useSession } from "@/providers/SessionProvider";
import { Tabs } from "expo-router";
import {
  HomeIcon,
  GraduationCapIcon,
  UserIcon,
  ChartNoAxesCombinedIcon,
  BookIcon,
  SparklesIcon,
  TrophyIcon,
} from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const { userId } = useSession();
  const { colors } = useTheme();

  const headerObject = {
    headerStyle: {
      backgroundColor: colors.card,
      shadowColor: colors.border,
    },
    headerTitleStyle: {
      color: colors.foreground,
    },
    headerTintColor: colors.foreground,
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.foreground,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 80,
        },
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          headerShown: false,
          ...headerObject,
        }}
      />
      <Tabs.Screen
        name="mindify-ai/index"
        options={{
          title: "Mindify AI",
          tabBarIcon: ({ color }) => <SparklesIcon size={24} color={color} />,
          headerShown: true,
          ...headerObject,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Apprendre",
          headerShown: true,
          tabBarIcon: ({ color }) => <GraduationCapIcon size={24} color={color} />,
          ...headerObject,
          href: null,
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: "Librairie",
          headerShown: true,
          tabBarIcon: ({ color }) => <BookIcon size={24} color={color} />,
          ...headerObject,
        }}
      />
      <Tabs.Screen
        name="leaderboard/index"
        options={{
          title: "Leaderboard",
          headerShown: true,
          headerTitle: "Leaderboard",
          tabBarIcon: ({ color }) => <TrophyIcon size={24} color={color} />,
          ...headerObject,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistiques",
          tabBarIcon: ({ color }) => <ChartNoAxesCombinedIcon size={24} color={color} />,
          headerShown: true,
          href: null,
          ...headerObject,
        }}
      />
      <Tabs.Screen
        name="profile/[userId]"
        options={{
          title: "Profil",
          headerShown: true,
          href: {
            pathname: "/profile/[userId]",
            params: {
              userId: userId ?? "",
            },
          },
          tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
          ...headerObject,
        }}
      />
    </Tabs>
  );
}
