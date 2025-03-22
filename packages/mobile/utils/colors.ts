import { colors } from "@/constants/colors";
import { ColorSchemeName } from "react-native";

/**
 * Retrieves the color set based on the specified theme.
 *
 * This function checks if the theme is "dark" and returns the corresponding
 * color set from the `colors` constant. If the theme is not "dark", it
 * returns the light color set.
 *
 * @param {ColorSchemeName} theme - The name of the color scheme, which can
 * be either "dark" or "light".
 * @returns {Object} The color set associated with the specified theme.
 */
export function getColors(theme: ColorSchemeName) {
  return colors[theme === "dark" ? "dark" : "light"];
}
