import CenteredContainer from "@/components/containers/CenteredContainer";
import ThemedText from "@/components/typography/ThemedText";
import { useTheme } from "@/providers/ThemeProvider";
import { FlatList, RefreshControl, View } from "react-native";
import MessageBubble from "@/components/features/mindify-ai/MessageBubble";
import { useRef } from "react";
import tw from "@/lib/tailwind";

type Message = {
  chat_id: number;
  sender: "user" | "AI";
  content: string;
  created_at: string;
  id: string;
};

export default function Messages({
  messages,
  refreshing,
  fetchMessages,
  numberOfPromptsLeft,
  disabled,
}: {
  messages: Message[];
  refreshing: boolean;
  fetchMessages: () => void;
  numberOfPromptsLeft: number;
  disabled: boolean;
}) {
  const flatListRef = useRef<FlatList>(null);

  const { colorStyles, colors } = useTheme();

  if (messages.length === 0) {
    return (
      <View style={tw`flex-1`}>
        <CenteredContainer>
          <ThemedText semibold style={[tw`text-center`, colorStyles.textForeground]}>
            Commence une conversation avec Mindify AI dès maintenant. Tu as encore{" "}
            {numberOfPromptsLeft} crédits aujourd'hui.
          </ThemedText>
        </CenteredContainer>
      </View>
    );
  }

  if (numberOfPromptsLeft === 0 || disabled) {
    return (
      <View style={tw`flex-1`}>
        <CenteredContainer>
          <ThemedText semibold style={[tw`text-center`, colorStyles.textForeground]}>
            Tu n'as plus de crédit pour aujourd'hui. Reviens demain !
          </ThemedText>
        </CenteredContainer>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      renderItem={(item) => <MessageBubble item={item.item} />}
      showsVerticalScrollIndicator={false}
      scrollsToTop={false}
      ref={flatListRef}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchMessages}
          tintColor={colors.foreground}
        />
      }
      contentContainerStyle={{
        paddingTop: 16,
      }}
    />
  );
}
