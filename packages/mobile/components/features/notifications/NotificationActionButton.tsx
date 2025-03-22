import GenericHapticButton from "@/components/ui/GenericHapticButton";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Swipeable } from "react-native-gesture-handler";
import tw from "@/lib/tailwind";

export default function NotificationActionButton({
  onPress,
  icon,
  children,
  bottomSheetModalRef,
  swipeableRef,
  destructive,
}: Readonly<{
  onPress: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  bottomSheetModalRef?: React.RefObject<BottomSheetModal>;
  swipeableRef?: React.RefObject<Swipeable>;
  destructive?: boolean;
}>) {
  const { colorStyles } = useTheme();

  return (
    <GenericHapticButton
      onPress={() => {
        bottomSheetModalRef?.current?.dismiss();
        swipeableRef?.current?.close();

        onPress();
      }}
      variant={destructive ? "destructive" : "black"}
      textVariant={destructive ? "textDestructive" : "textBlack"}
      icon={icon}
      padding="medium">
      <ThemedText
        style={[
          destructive ? colorStyles.textDestructiveForeground : colorStyles.textBackground,
          tw`text-lg`,
        ]}>
        {children}
      </ThemedText>
    </GenericHapticButton>
  );
}
