import ModalHeader from "@/components/global/modals/ModalHeader";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { Modal, StyleSheet, View } from "react-native";

/**
 * FullScreenModalContainer
 *
 * @param isVisible The visibility of the modal
 * @param children The children to render in the container
 * @param setIsVisible The function to set the visibility of the modal
 * @param headerName The name of the header
 * @returns The full screen modal container component
 */
export default function FullScreenModalContainer({
  isVisible,
  children,
  setIsVisible,
  headerName,
}: Readonly<{
  isVisible: boolean;
  children?: React.ReactNode | React.ReactNode[];
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  headerName: string;
}>) {
  const { colorStyles } = useTheme();

  return (
    <Modal animationType="slide" visible={isVisible}>
      <View style={[tw`flex-1`, styles.container, colorStyles.bgBackground]}>
        <ModalHeader name={headerName} onClose={() => setIsVisible(false)} />

        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
});
