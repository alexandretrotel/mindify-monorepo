import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function useChatLoadingAnimation(loading: boolean) {
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

  return { rotate };
}
