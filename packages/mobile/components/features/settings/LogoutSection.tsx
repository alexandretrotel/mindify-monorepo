import { View, StyleSheet } from "react-native";
import React from "react";
import { useSession } from "@/providers/SessionProvider";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedText from "@/components/typography/ThemedText";
import { colors } from "@/constants/colors";
import tw from "@/lib/tailwind";

export default function LegalSection() {
  const { handleLogout } = useSession();

  return (
    <View style={tw`flex-col gap-2 w-full`}>
      <HapticTouchableOpacity onPress={handleLogout} event="user_logged_out">
        <ThemedText semibold style={[styles.text, tw`text-center`]}>
          Se déconnecter
        </ThemedText>
      </HapticTouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.light.destructive,
  },
});
