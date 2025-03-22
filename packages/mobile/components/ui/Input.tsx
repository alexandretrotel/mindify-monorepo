import { InputModeOptions, type KeyboardTypeOptions, TextInput } from "react-native";
import tw from "@/lib/tailwind";
import { useTheme } from "@/providers/ThemeProvider";
import { Style } from "twrnc";

export default function Input({
  onChangeText,
  value,
  placeholder,
  style,
  secureTextEntry = false,
  autoCapitalize = "none",
  semibold = false,
  variant = "white",
  center = false,
  disabled = false,
  keyboardType,
  inputMode,
  ...props
}: Readonly<{
  onChangeText: (text: string) => void;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  semibold?: boolean;
  variant?: "black" | "white";
  center?: boolean;
  disabled?: boolean;
  style?: Style;
  keyboardType?: KeyboardTypeOptions | undefined;
  inputMode?: InputModeOptions | undefined;
}>) {
  const { colorStyles } = useTheme();

  return (
    <TextInput
      style={[
        tw.style(
          "border-b py-2",
          semibold && "font-semibold",
          center && "text-center",
          disabled && "opacity-50",
        ),
        colorStyles.border,
        colorStyles.textForeground,
      ]}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      inputMode={inputMode}
      value={value}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      placeholderTextColor={tw.color(variant === "black" ? "gray-500" : "gray-400")}
      editable={!disabled}
      {...props}
    />
  );
}
