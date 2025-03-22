import HapticPressable from "@/components/ui/haptic-buttons/HapticPressable";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import ThemedText from "@/components/typography/ThemedText";
import { View } from "react-native";
import tw from "@/lib/tailwind";

export default function TabLabelButton({
  children,
  activeTab,
  onClick,
}: Readonly<{
  children: React.ReactNode;
  activeTab: boolean;
  onClick: () => void;
}>) {
  const { colorStyles } = useTheme();

  return (
    <HapticPressable onPress={onClick} event="press_tab_label_button" eventProps={{ activeTab }}>
      <View
        style={[
          activeTab ? colorStyles.borderTransparent : colorStyles.border,
          activeTab ? colorStyles.bgPrimary : colorStyles.bgCard,
          tw`px-4 py-2 rounded-full border`,
        ]}>
        <ThemedText
          semibold
          style={activeTab ? colorStyles.textPrimaryForeground : colorStyles.textCardForeground}>
          {children}
        </ThemedText>
      </View>
    </HapticPressable>
  );
}
