import ThemedText from "@/components/typography/ThemedText";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import useRegister from "@/hooks/features/auth/useRegister";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
import { LockIcon, MailIcon, UserIcon } from "lucide-react-native";
import { View } from "react-native";

export default function LoginCore() {
  const { colorStyles, colors } = useTheme();
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSignUp,
    disabled,
    loading,
  } = useRegister();

  return (
    <View style={tw`flex-col gap-4`}>
      <ThemedTextInput
        placeholder="Nom d'utilisateur"
        value={name}
        onChangeText={setName}
        icon={<UserIcon size={16} color={colors.foreground} />}
      />
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
      <ThemedTextInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon={<LockIcon size={16} color={colors.foreground} />}
        isPasswordType
      />

      <GenericHapticButton
        event="user_logged_in"
        variant="default"
        textVariant="textDefault"
        onPress={handleSignUp}
        disabled={disabled || loading}
        loading={loading}>
        <ThemedText semibold style={[colorStyles.textPrimaryForeground]}>
          S'inscrire par e-mail
        </ThemedText>
      </GenericHapticButton>

      <View style={[tw`flex-row justify-center items-center gap-1`, colorStyles.textForeground]}>
        <ThemedText style={[tw`text-xs`, colorStyles.textForeground]}>Déjà inscrit ?</ThemedText>
        <HapticTouchableOpacity
          event="user_opened_reset_password"
          onPress={() => {
            router.replace("/login");
          }}>
          <ThemedText semibold style={[tw`text-xs text-primary`, colorStyles.textForeground]}>
            Se connecter
          </ThemedText>
        </HapticTouchableOpacity>
      </View>
    </View>
  );
}
