import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { Notifications } from "@/types/notifications";
import { View } from "react-native";

export default function SectionHeader({
  sections,
  title,
}: Readonly<{
  sections: {
    title: string;
    data: Notifications;
  }[];
  title: string;
}>) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={tw.style(
        `flex justify-between gap-4 items-center flex-row px-4`,
        sections?.filter((section) => section.data.length > 0)?.[0]?.title !== title && `mt-12`,
      )}>
      <ThemedText semibold style={[tw`text-base`, colorStyles.textForeground]}>
        {title}
      </ThemedText>
    </View>
  );
}
