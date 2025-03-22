import { renderHook, waitFor } from "@testing-library/react-native";
import useUserReadingStreak from "@/hooks/global/user/useUserReadingStreak";
import { getUserReadSummariesTimpestamps } from "@/actions/users.action";
import { summary } from "date-streaks";

jest.mock("@/actions/users.action", () => ({
  getUserReadSummariesTimpestamps: jest.fn(),
}));

describe("useUserReadingStreak", () => {
  const mockUserId = "user-id";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUserReadingStreak(mockUserId));

    expect(result.current.readingStreak).toBe(0);
    expect(result.current.readingDays).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.daysInFrench).toEqual([]);
  });

  it("should fetch user reading data successfully", async () => {
    const today = new Date();
    today.setDate(today.getDate());

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    const mockReadingData = [
      { read_at: today.toISOString() },
      { read_at: yesterday.toISOString() },
      { read_at: dayBeforeYesterday.toISOString() },
    ];
    const dates = mockReadingData.map((data) => new Date(data.read_at));

    (getUserReadSummariesTimpestamps as jest.Mock).mockResolvedValue(mockReadingData);

    const { result } = renderHook(() => useUserReadingStreak(mockUserId));

    await waitFor(() => {
      expect(result.current.readingData).toEqual(mockReadingData);
    });

    const streak = summary({ dates });

    expect(result.current.readingStreak).toBe(streak.currentStreak);
    expect(result.current.readingDays).toEqual(expect.any(Array));
    expect(result.current.loading).toBe(false);
    expect(result.current.daysInFrench).toEqual(expect.any(Array));
  });

  it("should handle errors during fetch user reading data", async () => {
    const mockError = new Error("Failed to fetch user reading data");
    (getUserReadSummariesTimpestamps as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserReadingStreak(mockUserId));

    await waitFor(() => {
      expect(result.current.readingStreak).toBe(0);
    });

    expect(result.current.readingDays).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.daysInFrench).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
