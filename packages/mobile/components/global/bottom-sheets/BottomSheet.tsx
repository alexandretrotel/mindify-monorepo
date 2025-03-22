import { View, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import tw, { Style } from "twrnc";
import { useTheme } from "@/providers/ThemeProvider";

const BottomSheet = forwardRef<
  BottomSheetModal,
  {
    children?: React.ReactNode;
    padding?: "small" | "medium" | "large";
    style?: Style;
    onChange: (index: number) => void;
    snapPoints: string[];
    index?: number;
  }
>(({ children, padding = "small", style, onChange, snapPoints, index = 0 }, ref) => {
  const { colorStyles } = useTheme();

  const paddingStyles = {
    small: tw`p-4`,
    medium: tw`p-6`,
    large: tw`p-8`,
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={index}
      snapPoints={snapPoints}
      onChange={onChange}
      style={styles.transparent}>
      <View style={[colorStyles.bgCard, paddingStyles[padding], tw.style(style)]}>{children}</View>
    </BottomSheetModal>
  );
});
BottomSheet.displayName = "BottomSheet";

export function BottomSheetHeader({
  children,
  style,
}: Readonly<{
  children: React.ReactNode;
  style?: string;
}>) {
  return <View style={tw.style(`w-full`, style)}>{children}</View>;
}

export function BottomSheetBody({
  children,
  style,
}: Readonly<{
  children: React.ReactNode;
  style?: string;
}>) {
  return <View style={tw.style(`w-full`, style)}>{children}</View>;
}

export function BottomSheetFooter({
  children,
  style,
}: Readonly<{
  children: React.ReactNode;
  style?: string;
}>) {
  return <View style={tw.style(`w-full mt-4`, style)}>{children}</View>;
}

const styles = StyleSheet.create({
  transparent: {
    backgroundColor: "transparent",
  },
});
