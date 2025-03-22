import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import ThemedText from "@/components/typography/ThemedText";
import GenericHapticButton from "@/components/ui/GenericHapticButton";
import useChat from "@/hooks/features/mindify-ai/useChat";
import { useChatMessages } from "@/hooks/features/mindify-ai/useChatMessages";
import tw from "@/lib/tailwind";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function MindifyAIScreen() {
  const router = useRouter();
  const { colorStyles } = useTheme();
  const { userId } = useSession();
  const { chatId } = useChat(userId);
  const { messages } = useChatMessages(chatId);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <HeaderPageContainer>
      <CenteredContainer>
        <Animated.View style={{ opacity }}>
          <View style={tw`flex-col gap-8 items-center justify-center`}>
            <View style={tw`flex-col`}>
              <ThemedText semibold style={[colorStyles.textForeground, tw`text-center text-2xl`]}>
                Bienvenue sur Mindify AI ✨
              </ThemedText>
              <ThemedText style={[colorStyles.textMutedForeground, tw`text-center text-base`]}>
                Mindify AI est un assistant virtuel qui vous aide à approfondir vos connaissances.
              </ThemedText>
            </View>

            <GenericHapticButton
              onPress={() => router.push("/chat")}
              event="user_opened_mindify_ai_chat"
              variant="black"
              textVariant="textBlack"
              padding="medium">
              {messages.length > 0 ? "Continuer la conversation" : "Démarrer une conversation"}
            </GenericHapticButton>
          </View>
        </Animated.View>
      </CenteredContainer>
    </HeaderPageContainer>
  );
}
