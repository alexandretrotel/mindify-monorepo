import NoHeaderModalContainer from "@/components/containers/modals/expo/NoHeaderModalContainer";
import tw from "@/lib/tailwind";
import AuthHeader from "@/components/features/auth/AuthHeader";
import Terms from "@/components/features/auth/Terms";
import LoginCore from "@/components/features/auth/login/LoginCore";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LogIn() {
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
        <AuthHeader name="Se connecter" />

        <View style={tw`flex-1 w-full justify-between pt-8 px-4`}>
          <LoginCore />
          <Terms />
        </View>
      </View>
    </NoHeaderModalContainer>
  );
}
