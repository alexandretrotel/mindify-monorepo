import CenteredContainer from "@/components/containers/CenteredContainer";
import HeaderPageContainer from "@/components/containers/HeaderPageContainer";
import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedActivityIndicator from "@/components/ui/ThemedActivityIndicator";
import useChat from "@/hooks/features/mindify-ai/useChat";
import { useChatMessages } from "@/hooks/features/mindify-ai/useChatMessages";
import { useDynamicSuggestions } from "@/hooks/features/mindify-ai/useDynamicSuggestions";
import tw from "@/lib/tailwind";
import { useSession } from "@/providers/SessionProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import { EllipsisIcon } from "lucide-react-native";
import { TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Suggestions from "@/components/features/mindify-ai/Suggestions";
import useChatLoadingAnimation from "@/hooks/features/mindify-ai/useChatLoadingAnimation";
import useOptions from "@/hooks/features/mindify-ai/useOptions";
import Messages from "@/components/features/mindify-ai/Messages";
import SendButton from "@/components/features/mindify-ai/SendButton";

export default function GeneralChat() {
  const { userId } = useSession();
  const { chatId, resetGeneralChatId, disabled, numberOfPromptsLeft } = useChat(userId);
  const {
    loading: loadingMessages,
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    setMessages,
    refreshing,
    fetchMessages,
    AIloading: loading,
  } = useChatMessages(chatId);
  const { suggestions, loading: loadingSuggestions } = useDynamicSuggestions(messages);
  const { handleNotificationsActionSheet } = useOptions(
    userId,
    chatId,
    messages,
    setMessages,
    resetGeneralChatId,
  );

  const { colorStyles, colors } = useTheme();
  const { rotate } = useChatLoadingAnimation(loading);
  const safeAreaInsets = useSafeAreaInsets();

  if (loadingMessages) {
    return (
      <HeaderPageContainer>
        <CenteredContainer>
          <ThemedActivityIndicator />
        </CenteredContainer>
      </HeaderPageContainer>
    );
  }

  return (
    <HeaderPageContainer noPadding keyboard>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HapticTouchableOpacity
              onPress={handleNotificationsActionSheet}
              event="user_opened_mindify_ai_chat_options">
              <EllipsisIcon size={24} color={colors.foreground} />
            </HapticTouchableOpacity>
          ),
        }}
      />

      <View style={tw`flex-1 pb-4 flex-col gap-4 px-4`}>
        <Messages
          messages={messages}
          refreshing={refreshing}
          fetchMessages={fetchMessages}
          numberOfPromptsLeft={numberOfPromptsLeft}
          disabled={disabled}
        />

        <View
          style={[
            tw`flex-col gap-4`,
            {
              paddingBottom: safeAreaInsets.bottom,
            },
          ]}>
          <Suggestions
            loading={loadingSuggestions}
            suggestions={suggestions}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            disabled={disabled}
          />

          <View style={tw`flex-row items-center`}>
            <TextInput
              style={[
                tw`flex-1 border rounded-md p-2 mr-2 h-10`,
                colorStyles.border,
                colorStyles.bgMuted,
                colorStyles.textForeground,
              ]}
              placeholderTextColor={colorStyles.textMutedForeground.color}
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Envoyer un message"
              onSubmitEditing={() => handleSendMessage(inputMessage)}
              blurOnSubmit={false}
            />

            <SendButton
              loading={loading}
              inputMessage={inputMessage}
              handleSendMessage={handleSendMessage}
              rotate={rotate}
              disabled={disabled}
            />
          </View>
        </View>
      </View>
    </HeaderPageContainer>
  );
}
