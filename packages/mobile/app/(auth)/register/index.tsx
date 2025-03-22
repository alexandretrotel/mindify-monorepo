import NoHeaderModalContainer from "@/components/containers/modals/expo/NoHeaderModalContainer";
import AuthHeader from "@/components/features/auth/AuthHeader";
import RegisterCore from "@/components/features/auth/register/RegisterCore";
import Terms from "@/components/features/auth/Terms";
import tw from "@/lib/tailwind";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Register() {
  const safeAreaInsets = useSafeAreaInsets();

  const paddingBottom = Platform.OS === "ios" ? safeAreaInsets.bottom : safeAreaInsets.bottom + 16;

  return (
    <NoHeaderModalContainer noSafeArea>
      <View
        style={[
          tw`flex-col h-full w-full`,
          {
            paddingBottom,
          },
        ]}>
        <AuthHeader name="S'inscrire" />

        <View style={tw`flex-1 w-full justify-between pt-8 px-4`}>
          <RegisterCore />
          <Terms />
        </View>
      </View>
    </NoHeaderModalContainer>
  );
}
