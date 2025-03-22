import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import HapticPressable from "@/components/ui/haptic-buttons/HapticPressable";

export default function TabButton({
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
    <HapticPressable
      style={[
        tw`border-b-2 py-2`,
        activeTab ? colorStyles.borderPrimary : colorStyles.borderTransparent,
      ]}
      onPress={onClick}
      event="press_tab_button"
      eventProps={{ activeTab }}>
      <ThemedText
        style={activeTab ? colorStyles.textForeground : colorStyles.textMutedForeground}
        semibold>
        {children}
      </ThemedText>
    </HapticPressable>
  );
}
