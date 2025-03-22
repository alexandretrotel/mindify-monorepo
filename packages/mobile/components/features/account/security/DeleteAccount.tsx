import GenericHapticButton from "@/components/ui/GenericHapticButton";
import ThemedText from "@/components/typography/ThemedText";
import useDeleteAccount from "@/hooks/features/account/security/useDeleteAccount";
import { useTheme } from "@/providers/ThemeProvider";
import { View } from "react-native";
import tw from "@/lib/tailwind";

export default function DeleteAccount() {
  const { colorStyles } = useTheme();
  const { isUpdating, handleDeleteAccount } = useDeleteAccount();

  return (
    <View style={tw`flex-col gap-4`}>
      <View>
        <ThemedText semibold style={[colorStyles.textForeground, tw`text-lg`]}>
          Supprimer mon compte
        </ThemedText>
        <ThemedText style={[colorStyles.textMutedForeground, tw`text-sm`]}>
          Tes données seront supprimées et tu ne pourras pas les récupérer.
        </ThemedText>
      </View>

      <GenericHapticButton
        variant="destructive"
        textVariant="textDestructive"
        event="user_deleted_account"
        onPress={handleDeleteAccount}
        loading={isUpdating}
        disabled={isUpdating}>
        Supprimer mon compte
      </GenericHapticButton>
    </View>
  );
}
