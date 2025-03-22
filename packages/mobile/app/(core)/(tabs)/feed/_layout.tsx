import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Accueil",
        }}
      />
    </Stack>
  );
}
