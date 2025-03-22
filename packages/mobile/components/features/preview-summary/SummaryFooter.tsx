import { useTheme } from "@/providers/ThemeProvider";
import { Platform, View } from "react-native";
import { useRouter } from "expo-router";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import tw from "@/lib/tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SummaryFooter({
  summaryId,
  isRead,
  handleBottomBarLayout,
}: Readonly<{
  summaryId: number;
  isRead: boolean;
  handleBottomBarLayout: (event: any) => void;
}>) {
  const { colorStyles } = useTheme();
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  return (
    <View
      style={[
        colorStyles.bgCard,
        colorStyles.borderMutedForeground,
        tw`absolute flex items-center justify-center bottom-0 inset-x-0 border-t`,
        {
          paddingBottom: paddingBottom,
        },
      ]}
      onLayout={handleBottomBarLayout}>
      <View style={[tw`flex-row items-center justify-between gap-4 pt-4 px-4`]}>
        <View style={tw`flex-col w-full gap-2 justify-center items-center`}>
          <GenericHapticButton
            onPress={() => {
              router.replace({
                pathname: "/summary/[summaryId]",
                params: { summaryId },
              });
            }}
            event="user_pressed_read_summary"
            eventProps={{ summaryId }}
            variant="default"
            textVariant="textDefault"
            padding="medium">
            {isRead ? "Relire le résumé" : "Lire le résumé"}
          </GenericHapticButton>
        </View>
      </View>
    </View>
  );
}
