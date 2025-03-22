import ThemedText from "@/components/typography/ThemedText";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import useLogIn from "@/hooks/features/auth/useLogIn";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { LockIcon, MailIcon } from "lucide-react-native";
import { Alert, View } from "react-native";

export default function LoginCore() {
  const { colorStyles, colors } = useTheme();
  const { email, setEmail, password, setPassword, handleSignIn, disabled, loading } = useLogIn();

  return (
    <View style={tw`flex-col gap-4`}>
      <ThemedTextInput
        placeholder="Adresse e-mail"
        value={email}
        onChangeText={setEmail}
        icon={<MailIcon size={16} color={colors.foreground} />}
      />
      <ThemedTextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        icon={<LockIcon size={16} color={colors.foreground} />}
        isPasswordType
      />

      <GenericHapticButton
        event="user_logged_in"
        variant="default"
        textVariant="textDefault"
        onPress={handleSignIn}
        disabled={disabled || loading}
        loading={loading}>
        <ThemedText semibold style={[colorStyles.textPrimaryForeground]}>
          Se connecter par e-mail
        </ThemedText>
      </GenericHapticButton>

      <View style={tw`flex-row justify-center items-center gap-1`}>
        <ThemedText style={[tw`text-xs`, colorStyles.textForeground]}>
          Mot de passe oublié ?
        </ThemedText>
        <HapticTouchableOpacity
          event="user_opened_reset_password"
          onPress={() => {
            Alert.alert(
              "Mot de passe oublié",
              "Il n'est pas possible de réinitialiser votre mot de passe pour le moment. Veuillez contacter le support.",
            );
          }}>
          <ThemedText semibold style={[tw`text-xs text-primary`, colorStyles.textForeground]}>
            Cliquer ici
          </ThemedText>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
