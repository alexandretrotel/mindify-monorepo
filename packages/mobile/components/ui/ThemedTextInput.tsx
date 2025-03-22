import { useTheme } from "@/providers/ThemeProvider";
import React, { useState } from "react";
import { InputModeOptions, KeyboardTypeOptions, TextInput, View } from "react-native";
import HapticTouchableOpacity from "./haptic-buttons/HapticTouchableOpacity";
import { EyeIcon, EyeOffIcon, XIcon } from "lucide-react-native";
import tw from "@/lib/tailwind";
import { Style } from "twrnc";

/**
 * A themed text input component that allows users to enter text.
 * It features a clear button (X) that appears when there is text input.
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - The current value of the text input.
 * @param {(query: string) => void} props.onChangeText - Callback function to handle text changes.
 * @param {string} props.placeholder - The placeholder text displayed in the input field.
 * @returns {JSX.Element} The rendered themed text input component.
 */
export default function ThemedTextInput({
  value,
  onChangeText,
  placeholder,
  inputMode,
  keyboardType,
  icon,
  isPasswordType,
  style,
}: Readonly<{
  value: string;
  onChangeText: (query: string) => void;
  placeholder: string;
  inputMode?: InputModeOptions | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  icon?: React.ReactNode;
  isPasswordType?: boolean;
  style?: Style | Style[];
}>) {
  const [secureTextEntry, setSecureTextEntry] = useState(!!isPasswordType);
  const [isFocused, setIsFocused] = useState(false);

  const { colorStyles, colors } = useTheme();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View style={[tw`relative w-full flex-row items-center`, style]}>
      <TextInput
        style={[
          isFocused ? colorStyles.borderPrimary : colorStyles.border,
          colorStyles.textForeground,
          colorStyles.bgMuted,
          tw`h-12 w-full py-2 border rounded-lg`,
          tw.style(icon ? "px-10" : "px-4"),
        ]}
        placeholderTextColor={colors.mutedForeground}
        placeholder={placeholder}
        inputMode={inputMode}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry && isPasswordType}
      />

      {icon && <View style={tw`absolute left-3`}>{icon}</View>}

      {isPasswordType && (
        <HapticTouchableOpacity
          style={tw`absolute right-3`}
          event="user_toggled_password_visibility"
          onPress={() => setSecureTextEntry(!secureTextEntry)}>
          {secureTextEntry ? (
            <EyeOffIcon size={16} color={colors.foreground} />
          ) : (
            <EyeIcon size={16} color={colors.foreground} />
          )}
        </HapticTouchableOpacity>
      )}

      {value.length > 0 && (
        <HapticTouchableOpacity
          style={[tw`absolute`, tw.style(isPasswordType ? "right-10" : "right-3")]}
          event="user_cleared_text_input"
          onPress={() => onChangeText("")}>
          <XIcon size={16} color={colors.foreground} />
        </HapticTouchableOpacity>
      )}
    </View>
  );
}
