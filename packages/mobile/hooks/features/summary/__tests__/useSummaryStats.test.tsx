import { renderHook, waitFor } from "@testing-library/react-native";
import useSummaryStats from "@/hooks/features/summary/useSummaryStats";
import {
  getSummaryRating,
  getSummaryReadCount,
  getSummarySavedCount,
} from "@/actions/summaries.action";

jest.mock("@/actions/summaries.action", () => ({
  getSummaryRating: jest.fn(),
  getSummaryReadCount: jest.fn(),
  getSummarySavedCount: jest.fn(),
}));

describe("useSummaryStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useSummaryStats(1));

    expect(result.current.readSummaryCount).toBe(0);
    expect(result.current.savedSummaryCount).toBe(0);
    expect(result.current.summaryRating).toBe(0);
    expect(result.current.showStats).toBe(false);
  });

  it("should fetch summary stats successfully", async () => {
    const mockReadCount = 10;
    const mockSavedCount = 5;
    const mockRating = 4.5;

    (getSummaryReadCount as jest.Mock).mockResolvedValue(mockReadCount);
    (getSummarySavedCount as jest.Mock).mockResolvedValue(mockSavedCount);
    (getSummaryRating as jest.Mock).mockResolvedValue(mockRating);

    const { result } = renderHook(() => useSummaryStats(1));

    await waitFor(() => {
      expect(result.current.readSummaryCount).toBe(mockReadCount);
    });
    expect(result.current.savedSummaryCount).toBe(mockSavedCount);
    expect(result.current.summaryRating).toBe(mockRating);
    expect(result.current.showStats).toBe(true);
  });

  it("should handle errors during fetch summary stats", async () => {
    const mockError = new Error("Failed to fetch summary stats");

    (getSummaryReadCount as jest.Mock).mockRejectedValue(mockError);
    (getSummarySavedCount as jest.Mock).mockRejectedValue(mockError);
    (getSummaryRating as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSummaryStats(1));

    expect(result.current.readSummaryCount).toBe(0);
    expect(result.current.savedSummaryCount).toBe(0);
    expect(result.current.summaryRating).toBe(0);
    expect(result.current.showStats).toBe(false);
  });
});
