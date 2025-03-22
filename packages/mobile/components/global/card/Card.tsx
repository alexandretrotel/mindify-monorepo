import { View } from "react-native";
import tw, { Style } from "twrnc";
import { useTheme } from "@/providers/ThemeProvider";

const paddingVariants = {
  small: "p-4",
  medium: "p-6",
  large: "p-8",
};

export function Card({
  children,
  padding = "small",
  style,
  noPadding,
}: Readonly<{
  children: React.ReactNode;
  padding?: "small" | "medium" | "large";
  style?: Style;
  noPadding?: boolean;
}>) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={[
        colorStyles.bgCard,
        colorStyles.borderMutedForeground,
        tw.style(
          `border rounded-lg flex-col justify-between gap-4`,
          style,
          noPadding ? "" : paddingVariants[padding],
        ),
      ]}>
      {children}
    </View>
  );
}

export function CardHeader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <View style={tw`w-full`}>{children}</View>;
}

export function CardBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <View style={tw`w-full`}>{children}</View>;
}

export function CardFooter({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <View style={tw`w-full mt-4`}>{children}</View>;
}
