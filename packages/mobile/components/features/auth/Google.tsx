import GenericHapticButton from "@/components/ui/GenericHapticButton";
import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Platform } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

export default function Google({
  disabled,
  buttonWidth,
}: {
  disabled?: boolean;
  buttonWidth: number;
}) {
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();

  const iosWebClientId = "470926317546-6c0c9en1qv8vp3ucpajo1nkrshf4m672.apps.googleusercontent.com";
  const webClientId = "470926317546-pr9klr85jts6r08n7m8pr6v9usuod63b.apps.googleusercontent.com";

  GoogleSignin.configure({
    webClientId: webClientId,
    iosClientId: iosWebClientId,
  });

  const finalWidth = Platform.OS === "ios" ? buttonWidth : "100%";

  return (
    <GenericHapticButton
      style={{ width: finalWidth }}
      variant="white"
      textVariant="textWhite"
      event="user_clicked_on_google_login"
      disabled={disabled}
      loading={loading}
      icon={<Ionicons name="logo-google" size={20} color={colors.foreground} />}
      onPress={async () => {
        setLoading(true);

        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo?.data?.idToken) {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.data.idToken,
            });

            if (error) {
              console.error(error);
              throw new Error("Erreur lors de la connexion avec Google");
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }}>
      {Platform.OS === "ios" ? "Google" : "Se connecter avec Google"}
    </GenericHapticButton>
  );
}
