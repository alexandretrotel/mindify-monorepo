import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { View } from "react-native";

/**
 * CenteredContainer
 *
 * @param children The children to render in the container
 * @param noPadding Whether to remove padding from the container
 * @returns The centered container component
 */
export default function CenteredContainer({
  children,
  noPadding,
}: Readonly<{
  children?: React.ReactNode | React.ReactNode[];
  noPadding?: boolean;
}>) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={[
        colorStyles.bgBackground,
        tw.style(`flex items-center justify-center h-full`, !noPadding && `px-4`),
      ]}>
      {children}
    </View>
  );
}
