import GenericHapticButton from "@/components/ui/GenericHapticButton";
import ThemedText from "@/components/typography/ThemedText";
import useChangePassword from "@/hooks/features/account/security/useChangePassword";
import { useTheme } from "@/providers/ThemeProvider";
import { View } from "react-native";
import tw from "@/lib/tailwind";
import ThemedTextInput from "@/components/ui/ThemedTextInput";

export default function ChangePassword() {
  const { colorStyles } = useTheme();
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isUpdating,
    handleChangePassword,
  } = useChangePassword();

  const isDisabled =
    isUpdating || !newPassword || !confirmPassword || newPassword !== confirmPassword;

  return (
    <View style={tw`flex-col gap-4`}>
      <View>
        <ThemedText semibold style={[colorStyles.textForeground, tw`text-lg`]}>
          Mot de passe
        </ThemedText>
        <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
          Change ton mot de passe pour sécuriser ton compte.
        </ThemedText>
      </View>

      <View style={tw`flex-col gap-4`}>
        <ThemedTextInput
          placeholder="Nouveau mot de passe"
          isPasswordType
          inputMode="text"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <ThemedTextInput
          placeholder="Confirmer le mot de passe"
          isPasswordType
          inputMode="text"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>

      <View style={tw`mt-4`}>
        <GenericHapticButton
          disabled={isDisabled}
          loading={isUpdating}
          onPress={handleChangePassword}
          variant="default"
          textVariant="textDefault"
          event="change_password_clicked">
          Changer le mot de passe
        </GenericHapticButton>
      </View>
    </View>
  );
}
