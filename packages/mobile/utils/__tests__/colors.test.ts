import { getColors } from "@/utils/colors";
import { colors } from "@/constants/colors";

describe("getColors", () => {
  it('should return dark colors when theme is "dark"', () => {
    const theme = "dark";
    const expectedColors = colors.dark;
    const result = getColors(theme);

    expect(result).toEqual(expectedColors);
  });

  it('should return light colors when theme is "light"', () => {
    const theme = "light";
    const expectedColors = colors.light;
    const result = getColors(theme);

    expect(result).toEqual(expectedColors);
  });

  it("should return light colors when theme is undefined", () => {
    const theme = undefined;
    const expectedColors = colors.light;
    const result = getColors(theme);

    expect(result).toEqual(expectedColors);
  });
});
