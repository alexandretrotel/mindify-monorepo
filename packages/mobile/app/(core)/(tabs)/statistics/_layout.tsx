import { Stack } from "expo-router";
import React from "react";

export default function StatisticsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Statistiques",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
