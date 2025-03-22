import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

/**
 * HeaderPageContainer
 *
 * @param children The children to render in the container
 * @param noPadding Whether to remove padding from the container
 * @returns The header page container component
 */
export default function HeaderPageContainer({
  children,
  noPadding,
  keyboard,
}: Readonly<{
  children?: React.ReactNode | React.ReactNode[];
  noPadding?: boolean;
  keyboard?: boolean;
}>) {
  const { colorStyles } = useTheme();

  if (!keyboard) {
    return (
      <View
        style={[
          colorStyles.bgBackground,
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
          tw.style(`flex w-full justify-start flex-col h-full`, !noPadding && `px-4`),
        ]}>
        {children}
      </View>
    </KeyboardAvoidingView>
  );
}
