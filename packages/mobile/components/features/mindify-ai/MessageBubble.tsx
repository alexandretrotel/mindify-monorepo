import ThemedText from "@/components/typography/ThemedText";
import ThemedMarkdown from "@/components/ui/ThemedMarkdown";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { View } from "react-native";

export default function MessageBubble({
  item,
}: {
  item: {
    chat_id: number;
    sender: "user" | "AI";
    content: string;
    created_at: string;
    id: string;
  };
}) {
  const { colorStyles } = useTheme();

  return (
    <View
      style={[
        item.sender === "user"
          ? tw`self-end rounded-lg p-2 px-3 my-1 max-w-3/4`
          : tw`self-start rounded-lg p-2 px-0 my-1`,
        item.sender === "user" && colorStyles.bgMuted,
      ]}>
      {item.sender === "user" ? (
        <ThemedText style={[colorStyles.textForeground, tw`text-base`]}>{item.content}</ThemedText>
      ) : (
        <ThemedMarkdown>{item.content}</ThemedMarkdown>
      )}
    </View>
  );
}
