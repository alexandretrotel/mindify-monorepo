import Markdown from "react-native-markdown-display";
import { StyleSheet } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemedMarkdown({ children }: { children: string }) {
  const { colors } = useTheme();

  const markdownStyles = StyleSheet.create({
    body: {
      color: colors.foreground,
      fontSize: 18,
      lineHeight: 20,
    },
    paragraph: {
      color: colors.foreground,
      fontSize: 18,
      lineHeight: 20,
    },
    heading1: {
      color: colors.foreground,
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 16,
      lineHeight: 32,
    },
    heading2: {
      color: colors.foreground,
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 16,
      lineHeight: 28,
    },
    heading3: {
      color: colors.foreground,
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 16,
      lineHeight: 24,
    },
    link: { color: colors.primary },
    strong: { color: colors.foreground, fontWeight: "bold", fontSize: 18, lineHeight: 20 },
    em: { color: colors.foreground, fontStyle: "italic" },
    list_item: { color: colors.foreground },
    blockquote: {
      color: colors.foreground,
      borderLeftColor: colors.border,
      borderLeftWidth: 4,
      paddingLeft: 8,
    },
    code_block: {
      color: colors.foreground,
      backgroundColor: colors.muted,
      padding: 8,
      borderRadius: 4,
      borderColor: colors.border,
    },
    code_inline: {
      color: colors.foreground,
      backgroundColor: colors.muted,
      padding: 4,
      borderRadius: 4,
      borderColor: colors.border,
    },
  });

  return <Markdown style={markdownStyles}>{children}</Markdown>;
}
