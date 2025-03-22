import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

/**
 * NoHeaderPageContainer
 *
 * @param children The children to render in the container
 * @param noPadding Whether to remove padding from the container
 * @param noSafeArea Whether to remove safe area from the container
 * @returns The no header page container component
 */
export default function NoHeaderPageContainer({
  children,
  noPadding,
  noSafeArea,
  keyboard,
}: Readonly<{
  children?: React.ReactNode | React.ReactNode[];
  noPadding?: boolean;
  noSafeArea?: boolean;
  keyboard?: boolean;
}>) {
  const safeInsets = useSafeAreaInsets();
  const { colorStyles } = useTheme();

  if (!keyboard) {
    return (
      <View
        style={[
          colorStyles.bgBackground,
          {
            paddingTop: noSafeArea ? 0 : safeInsets.top,
          },
          tw.style(`flex w-full justify-start flex-col h-full`, !noPadding && `px-4`),
        ]}>
        {children}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
      enabled={keyboard}>
      <View
        style={[
          colorStyles.bgBackground,
          {
            paddingTop: noSafeArea ? 0 : safeInsets.top,
          },
          tw.style(`flex w-full justify-start flex-col h-full`, !noPadding && `px-4`),
        ]}>
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}
