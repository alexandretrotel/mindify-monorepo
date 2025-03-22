import ThemedText from "@/components/typography/ThemedText";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import { UserIcon } from "lucide-react-native";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import useMissingName from "@/hooks/features/account/profile/useMissingName";
import FullScreenModalContainer from "@/components/containers/modals/FullScreenModalContainer";

export default function MissingName({
  friendsModalVisible,
  setFriendsModalVisible,
}: {
  friendsModalVisible: boolean;
  setFriendsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { name, setName, disabled, loading, handleAddMissingName } =
    useMissingName(setFriendsModalVisible);
  const { colorStyles, colors } = useTheme();

  const paddingBottom = Platform.OS === "ios" ? 0 : 16;

  return (
    <FullScreenModalContainer
      isVisible={friendsModalVisible}
      setIsVisible={setFriendsModalVisible}
      headerName="Renseigne ton nom">
      <SafeAreaProvider>
        <View
          style={[
            tw`flex-col h-full`,
            {
              paddingBottom,
            },
          ]}>
          <View style={tw`px-4 justify-between h-full flex-col py-8`}>
            <View style={tw`flex-col gap-4`}>
              <ThemedText style={[tw`text-sm`, colorStyles.textCardForeground]}>
                Pour ajouter un ami, tu dois rentrer ton nom.
              </ThemedText>

              <ThemedTextInput
                placeholder="Nom d'utilisateur"
                value={name}
                onChangeText={setName}
                icon={<UserIcon size={20} color={colors.foreground} />}
              />
            </View>

            <GenericHapticButton
              variant="default"
              textVariant="textDefault"
              event="user_saved_missing_name"
              onPress={handleAddMissingName}
              disabled={disabled}
              loading={loading}>
              Enregistrer
            </GenericHapticButton>
          </View>
        </View>
      </SafeAreaProvider>
    </FullScreenModalContainer>
  );
}
