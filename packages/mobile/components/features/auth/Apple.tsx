import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "@/lib/supabase";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function Apple({
  disabled,
  buttonWidth,
}: Readonly<{ disabled?: boolean; buttonWidth: number }>) {
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();

  if (Platform.OS === "ios")
    return (
      <GenericHapticButton
        style={{ width: buttonWidth }}
        onPress={async () => {
          setLoading(true);

          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (credential.identityToken) {
              const { error } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });

              if (error) {
                console.error(error);
                throw new Error("Erreur lors de la connexion avec Apple");
              }
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        }}
        variant="white"
        textVariant="textWhite"
        event="user_signed_with_apple"
        disabled={disabled}
        loading={loading}
        icon={<Ionicons name="logo-apple" size={20} color={colors.foreground} />}>
        Apple
      </GenericHapticButton>
    );
}
