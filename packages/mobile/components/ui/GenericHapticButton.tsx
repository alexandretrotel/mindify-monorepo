import HapticTouchableOpacity from "@/components/ui/haptic-buttons/HapticTouchableOpacity";
import ThemedText from "@/components/typography/ThemedText";
import { Animated, Easing, View } from "react-native";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useRef } from "react";
import { Loader2Icon } from "lucide-react-native";
import tw, { Style } from "twrnc";

interface GenericHapticButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant: "default" | "destructive" | "outline" | "secondary" | "black" | "white";
  textVariant:
    | "textDefault"
    | "textDestructive"
    | "textSecondary"
    | "textOutline"
    | "textBlack"
    | "textWhite";
  onPress?: () => void;
  asChild?: boolean;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  loading?: boolean;
  padding?: "small" | "medium" | "large";
  style?: Style;
  event: string;
  eventProps?: Record<string, any>;
}

export default function GenericHapticButton({
  children,
  disabled,
  variant,
  onPress,
  icon,
  iconOnRight,
  padding = "small",
  loading,
  style,
  event,
  eventProps,
  ...props
}: Readonly<GenericHapticButtonProps>) {
  const { colorStyles, colors } = useTheme();

  const buttonStyles = tw.style(
    `rounded-full w-full`,
    padding === "small" ? "p-2 py-3" : padding === "medium" ? "p-4 py-4" : "p-6 py-6",
    disabled ? "opacity-50" : "",
  );

  const getButtonStyle = () => {
    switch (variant) {
      case "default":
        return colorStyles.bgPrimary;
      case "destructive":
        return colorStyles.bgDestructive;
      case "secondary":
        return colorStyles.bgSecondary;
      case "outline":
        return colorStyles.bgBackground;
      case "black":
        return colorStyles.bgForeground;
      case "white":
        return colorStyles.bgBackground;
      default:
        return colorStyles.bgPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "default":
        return colorStyles.textPrimaryForeground;
      case "destructive":
        return colorStyles.textDestructiveForeground;
      case "secondary":
        return colorStyles.textSecondaryForeground;
      case "outline":
        return colorStyles.textForeground;
      case "black":
        return colorStyles.textBackground;
      case "white":
        return colorStyles.textForeground;
      default:
        return colorStyles.textPrimaryForeground;
    }
  };

  const getTextSize = () => {
    switch (padding) {
      case "small":
        return "text-lg";
      case "medium":
        return "text-xl";
      case "large":
        return "text-2xl";
      default:
        return "text-lg";
    }
  };

  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      rotateValue.setValue(0);

      const animation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      animation.start();

      return () => animation.stop();
    } else {
      rotateValue.setValue(0);
    }
  }, [loading, rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderContent = () => {
    if (loading) {
      return (
        <View style={tw`justify-center items-center gap-2`}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Loader2Icon
              size={24}
              color={variant === "default" ? colors.primaryForeground : colors.foreground}
            />
          </Animated.View>
        </View>
      );
    } else if (icon) {
      return (
        <View
          style={tw.style(
            "flex-row items-center justify-center gap-2",
            iconOnRight ? "flex-row-reverse" : "",
          )}>
          {icon}
          <ThemedText semibold style={[getTextStyle(), tw`${getTextSize()} text-center`]}>
            {children}
          </ThemedText>
        </View>
      );
    } else {
      return (
        <ThemedText semibold style={[getTextStyle(), tw`${getTextSize()} text-center`]}>
          {children}
        </ThemedText>
      );
    }
  };

  return (
    <HapticTouchableOpacity
      style={[getButtonStyle(), buttonStyles, style]}
      onPress={onPress ? onPress : () => {}}
      event={event}
      eventProps={eventProps}
      disabled={disabled}
      {...props}>
      {renderContent()}
    </HapticTouchableOpacity>
  );
}
