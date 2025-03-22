import { renderHook, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeedProvider, { useFeed } from "@/providers/FeedProvider";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("FeedProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("loads initial settings from AsyncStorage", async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce("false")
      .mockResolvedValueOnce("true");

    const { result } = renderHook(() => useFeed(), { wrapper: FeedProvider });

    await waitFor(() => {
      expect(result.current.shouldAnimateText).toBe(false);
    });
    expect(result.current.shouldPlaySound).toBe(true);
  });

  test("toggles shouldAnimateText and updates AsyncStorage", async () => {
    const { result } = renderHook(() => useFeed(), { wrapper: FeedProvider });

    expect(result.current.shouldAnimateText).toBe(true);

    result.current.handleToggleShouldAnimateText();

    await waitFor(() => {
      expect(result.current.shouldAnimateText).toBe(false);
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("shouldAnimateText", JSON.stringify(false));
  });

  test("toggles shouldPlaySound and updates AsyncStorage", async () => {
    const { result } = renderHook(() => useFeed(), { wrapper: FeedProvider });

    expect(result.current.shouldPlaySound).toBe(true);

    result.current.handleToggleShouldPlaySound();

    await waitFor(() => {
      expect(result.current.shouldPlaySound).toBe(false);
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("shouldPlaySound", JSON.stringify(false));
  });
});
