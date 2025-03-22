import { StyleSheet } from "react-native";

export const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
  },
  flippedCard: {
    backfaceVisibility: "hidden",
    zIndex: 2,
    width: "100%",
    height: "100%",
  },
});
