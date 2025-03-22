import ThemedText from "@/components/typography/ThemedText";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import tw from "@/lib/tailwind";
import { View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { privacyURL, termsURL } from "@/constants/url";
import { useTheme } from "@/providers/ThemeProvider";

export default function Terms() {
  const { colorStyles } = useTheme();

  return (
    <View style={tw`flex-wrap justify-center items-center flex-row`}>
      <ThemedText style={[tw`text-center text-xs`, colorStyles.textForeground]}>
        En continuant vous acceptez nos
      </ThemedText>

      <HapticTouchableOpacity
        event="user_opened_terms"
        onPress={() => {
          WebBrowser.openBrowserAsync(termsURL);
        }}>
        <ThemedText semibold style={[tw`text-xs text-primary ml-1`, colorStyles.textForeground]}>
          Conditions d'utilisation
        </ThemedText>
      </HapticTouchableOpacity>

      <ThemedText style={[tw`text-xs mt-4`, colorStyles.textForeground]}> et notre </ThemedText>

      <HapticTouchableOpacity
        event="user_opened_privacy_policy"
        onPress={() => {
          WebBrowser.openBrowserAsync(privacyURL);
        }}>
        <ThemedText semibold style={[tw`text-xs text-primary ml-1`, colorStyles.textForeground]}>
          Politique de confidentialité
        </ThemedText>
      </HapticTouchableOpacity>

      <ThemedText style={[tw`text-xs`, colorStyles.textForeground]}>.</ThemedText>
    </View>
  );
}
