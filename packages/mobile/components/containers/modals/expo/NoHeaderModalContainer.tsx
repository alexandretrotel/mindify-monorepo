import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import tw from "@/lib/tailwind";

/**
 * NoHeaderModalContainer
 *
 * @param children The children to render in the container
 * @returns The no header modal container component
 */
export default function NoHeaderModalContainer({
  children,
  noSafeArea,
}: Readonly<{ children?: React.ReactNode | React.ReactNode[]; noSafeArea?: boolean }>) {
  const { colorStyles } = useTheme();

  if (noSafeArea) {
    return <View style={[tw`flex-1`, styles.container, colorStyles.bgBackground]}>{children}</View>;
  }

  return (
    <View style={[tw`flex-1`]}>
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, colorStyles.bgBackground]}>{children}</SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
});
